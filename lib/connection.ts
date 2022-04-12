import { Socket } from 'net';
import { ClientPacketEventEmitter, ServerPacketEventEmitter } from './events';
import { Packet } from './packet';
import { SERVER_HOST, ServerPort } from './constants';

export class Connection {
  private socket: Socket;
  clientPackets: ClientPacketEventEmitter;
  serverPackets: ServerPacketEventEmitter;

  constructor() {
    this.socket = new Socket();
    this.clientPackets = new ClientPacketEventEmitter((packet) =>
      this.socket.write(packet.toBuffer())
    );
    this.serverPackets = new ServerPacketEventEmitter();
  }

  open(host = SERVER_HOST, port = ServerPort.TEST_SERVER): Promise<void> {
    return new Promise((resolve, reject) => {
      let previousData = Buffer.alloc(0);

      this.socket
        .on('error', reject)
        .on('close', () => {
          // TODO: Provide a way for calling code to shutdown when socket disconnects.
        })
        .on('data', (data) => {
          const { packets, partial } = Packet.fromBuffer(
            Buffer.concat([previousData, data]) // Prepend any partial packet data received previously.
          );

          packets.forEach((packet) => {
            this.serverPackets.receivePacket(packet);
          });

          previousData = partial;
        })
        .connect(port, host, resolve);
    });
  }

  close() {
    this.socket.destroy();
  }
}
