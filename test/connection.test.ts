import { Socket, Server, createServer } from 'net';
import { Connection } from '../lib/connection';
import { ClientPacket, ClientPacketType } from '../lib/data/client';
import { ServerPacket, ServerPacketType } from '../lib/data/server';

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

  connection.client.emit(ClientPacketType.LOG_IN, {
    username: 'Test',
    password: 'incorrect_password',
  });
  const { reason } = await connection.server.once(
    ServerPacketType.LOG_IN_NOT_OK
  );
  expect(reason).toBe('Wrong password.');

  connection.client.emit(ClientPacketType.LOG_IN, {
    username: 'Test',
    password: 'correct_password',
  });
  await connection.server.once(ServerPacketType.LOG_IN_OK);

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
    let previousBuffer = Buffer.alloc(0);

    socket.on('data', (buffer) => {
      const { packets, remainingBuffer } = ClientPacket.fromBuffer(
        // Prepend any partial (overflow/underflow) packet data received previously.
        Buffer.concat([previousBuffer, buffer])
      );

      packets.forEach((packet) => {
        this.onPacketReceived(socket, packet);
      });

      previousBuffer = remainingBuffer;
    });
  }

  private onPacketReceived<Type extends ClientPacketType>(
    socket: Socket,
    packet: ClientPacket<Type>
  ) {
    if (ClientPacket.isType(packet, ClientPacketType.LOG_IN)) {
      if (
        packet.data.username === 'Test' &&
        packet.data.password === 'correct_password'
      ) {
        this.sendPacket(
          socket,
          new ServerPacket(ServerPacketType.LOG_IN_OK, {})
        );
      } else {
        this.sendPacket(
          socket,
          new ServerPacket(ServerPacketType.LOG_IN_NOT_OK, {
            reason: 'Wrong password.',
          })
        );
      }
    } else if (ClientPacket.isType(packet, ClientPacketType.PING)) {
      this.sendPacket(
        socket,
        new ServerPacket(ServerPacketType.PONG, { echo: packet.data.echo })
      );
    }
  }

  private sendPacket<Type extends ServerPacketType>(
    socket: Socket,
    packet: ServerPacket<Type>
  ) {
    socket.write(packet.toBuffer());
  }
}
