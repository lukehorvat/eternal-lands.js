import { Socket } from 'net';
import { ClientPacketEventEmitter, ServerPacketEventEmitter } from './events';
import { Packet } from './packet';
import { SERVER_HOST, ServerPort } from './constants';

export class Connection {
  private socket: Socket;

  client: ClientPacketEventEmitter;
  server: ServerPacketEventEmitter;

  constructor() {
    this.socket = new Socket();
    this.client = new ClientPacketEventEmitter((packet) =>
      this.socket.write(packet.toBuffer())
    );
    this.server = new ServerPacketEventEmitter();
  }

  connect({
    host = SERVER_HOST,
    port = ServerPort.TEST_SERVER,
    onDisconnect,
  }: {
    host?: string;
    port?: number;
    onDisconnect?: () => void;
  } = {}): Promise<void> {
    return new Promise((resolve, reject) => {
      let previousData = Buffer.alloc(0);

      this.socket
        .on('error', reject)
        .on('close', () => onDisconnect?.())
        .on('data', (data) => {
          const { packets, partial } = Packet.fromBuffer(
            Buffer.concat([previousData, data]) // Prepend any partial packet data received previously.
          );

          packets.forEach((packet) => {
            this.server.receivePacket(packet);
          });

          previousData = partial;
        })
        .connect(port, host, resolve);
    });
  }

  disconnect() {
    this.socket.destroy();
  }
}
