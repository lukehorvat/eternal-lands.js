import { Socket, Server, createServer } from 'net';
import { ClientPacket, ClientPacketType } from '../../lib/packets/client';
import { ServerPacket, ServerPacketType } from '../../lib/packets/server';

type ServerOptions = {
  port?: number;
};

export class MockTcpSocketServer {
  private readonly options?: ServerOptions;
  private server?: Server;

  constructor(options?: ServerOptions) {
    this.options = options;
  }

  start(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.server = createServer()
        .once('listening', resolve)
        .once('error', reject)
        .on('connection', (socket) => {
          this.onClientConnected(socket);
        })
        .listen(this.options?.port);
    });
  }

  stop(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (!this.server) {
        return resolve();
      }

      this.server.close((err) => (err ? reject(err) : resolve()));
    });
  }

  private onClientConnected(socket: Socket): void {
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
  ): void {
    if (ClientPacket.isType(packet, ClientPacketType.LOG_IN)) {
      if (
        packet.data.username === 'Test' &&
        packet.data.password === 'good_password'
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
        new ServerPacket(ServerPacketType.PONG, packet.data)
      );
    }
  }

  private sendPacket<Type extends ServerPacketType>(
    socket: Socket,
    packet: ServerPacket<Type>
  ): void {
    socket.write(packet.toBuffer());
  }
}
