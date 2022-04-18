import { Socket } from 'net';
import { ClientPacketEventEmitter, ServerPacketEventEmitter } from './events';
import { Packet } from './packet';
import { SERVER_HOST, ServerPort } from './constants';

export class Connection {
  private host: string;
  private port: number;
  private onDisconnect?: () => void;
  private socket: Socket;

  client: ClientPacketEventEmitter;
  server: ServerPacketEventEmitter;

  constructor({
    host = SERVER_HOST,
    port = ServerPort.TEST_SERVER,
    onDisconnect,
  }: {
    host?: string;
    port?: number;
    onDisconnect?: () => void;
  } = {}) {
    this.host = host;
    this.port = port;
    this.onDisconnect = onDisconnect;
    this.socket = new Socket();
    this.client = new ClientPacketEventEmitter((packet) => {
      this.socket.write(packet.toBuffer());
    });
    this.server = new ServerPacketEventEmitter();
  }

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      let previousBuffer = Buffer.alloc(0);

      this.socket
        .on('error', reject)
        .on('close', () => this.onDisconnect?.())
        .on('data', (buffer) => {
          const { packets, partial } = Packet.fromBuffer(
            // Prepend any partial (overflow/underflow) packet data received previously.
            Buffer.concat([previousBuffer, buffer])
          );

          packets.forEach((packet) => {
            this.server.receivePacket(packet);
          });

          previousBuffer = partial;
        })
        .connect(this.port, this.host, resolve);
    });
  }

  disconnect() {
    this.socket.destroy();
    this.onDisconnect?.();
  }
}
