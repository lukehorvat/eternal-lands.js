import { Socket, Server, createServer } from 'net';
import { Connection } from '../lib/connection';
import { ClientPacketDataParsers, ClientPacketType } from '../lib/data/client';
import { ServerPacketDataParsers, ServerPacketType } from '../lib/data/server';
import { Packet } from '../lib/data/packets';

let server: MockELServer;
let connection: Connection;

beforeEach(() => {
  server = new MockELServer({ port: 8000 });
  connection = new Connection({
    host: 'localhost',
    port: 8000,
  });
});

afterEach(() => {
  connection.disconnect();
  server.stop();
});

test('Connects, sends, and receives packets', async () => {
  await server.start();
  await connection.connect();

  connection.client.emit(ClientPacketType.PING, { echo: 123 });
  const { echo } = await connection.server.once(ServerPacketType.PONG);
  expect(echo).toBe(123);
});

test('Throws an error when a connection cannot be established', async () => {
  await expect(connection.connect()).rejects.toThrow();
});

class MockELServer {
  private port: number;
  private server?: Server;

  constructor({ port }: { port: number }) {
    this.port = port;
  }

  start(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.server = createServer()
        .on('listening', resolve)
        .on('error', reject)
        .on('connection', (socket) => {
          this.onClientConnected(socket);
        })
        .listen(this.port);
    });
  }

  stop() {
    this.server?.close();
  }

  private onClientConnected(socket: Socket) {
    socket.on('data', (buffer) => {
      const { packets } = Packet.fromBuffer(buffer);

      packets.forEach((packet) => {
        this.onPacketReceived(socket, packet);
      });
    });
  }

  private onPacketReceived(socket: Socket, packet: Packet) {
    if (packet.type === ClientPacketType.PING) {
      const { echo } = ClientPacketDataParsers[
        ClientPacketType.PING
      ].fromBuffer(packet.dataBuffer);

      this.sendPacket(
        socket,
        new Packet(
          ServerPacketType.PONG,
          ServerPacketDataParsers[ServerPacketType.PONG].toBuffer({ echo })
        )
      );
    }
  }

  private sendPacket(socket: Socket, packet: Packet) {
    socket.write(packet.toBuffer());
  }
}
