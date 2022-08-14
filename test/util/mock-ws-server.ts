import { WebSocket, WebSocketServer } from 'ws';
import { ClientPacket, ClientPacketType } from '../../lib/packets/client';
import { ServerPacket, ServerPacketType } from '../../lib/packets/server';

type ServerOptions = {
  port?: number;
};

export class MockWebSocketServer {
  private readonly options?: ServerOptions;
  private server?: WebSocketServer;

  constructor(options?: ServerOptions) {
    this.options = options;
  }

  start(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.server = new WebSocketServer({ port: this.options?.port })
        .once('listening', resolve)
        .once('error', reject)
        .on('connection', (socket) => {
          this.onClientConnected(socket);
        });
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

  private onClientConnected(socket: WebSocket): void {
    let previousBuffer = Buffer.alloc(0);

    socket.on('message', (data) => {
      if (data instanceof Buffer) {
        const { packets, remainingBuffer } = ClientPacket.fromBuffer(
          // Prepend any partial (overflow/underflow) packet data received previously.
          Buffer.concat([previousBuffer, data])
        );

        packets.forEach((packet) => {
          this.onPacketReceived(socket, packet);
        });

        previousBuffer = remainingBuffer;
      }
    });
  }

  private onPacketReceived<Type extends ClientPacketType>(
    socket: WebSocket,
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
    socket: WebSocket,
    packet: ServerPacket<Type>
  ): void {
    socket.send(packet.toBuffer());
  }
}
