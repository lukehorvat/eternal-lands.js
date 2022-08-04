import { Socket } from 'net';
import Emittery from 'emittery';
import { ServerPacket, ServerPacketData } from './data/server';
import { ClientPacket, ClientPacketData } from './data/client';
import { SERVER_HOST, ServerPort } from './constants';

export class Connection {
  private host: string;
  private port: number;
  private onDisconnect?: () => void;
  private socket: Socket;

  client: Emittery<ClientPacketData>;
  server: Emittery<ServerPacketData>;

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
    this.client = new Emittery<ClientPacketData>();
    this.server = new Emittery<ServerPacketData>();
  }

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      let previousBuffer = Buffer.alloc(0);

      this.socket
        .on('error', reject)
        .on('close', () => this.onDisconnect?.())
        .on('data', (buffer) => {
          const { packets, remainingBuffer } = ServerPacket.fromBuffer(
            // Prepend any partial (overflow/underflow) packet data received previously.
            Buffer.concat([previousBuffer, buffer])
          );

          packets.forEach((packet) => {
            this.server.emit(packet.type, packet.data);
          });

          previousBuffer = remainingBuffer;
        })
        .on('connect', () => {
          // TODO: Would be better to send packet on client.emit() so that
          // client.on() and client.onAny() (which userland might use) are
          // only triggered after a packet has been successfully sent.
          this.client.onAny((type, data) => {
            return new Promise((resolve, reject) => {
              const packet = new ClientPacket(type, data);
              this.socket.write(packet.toBuffer(), (err) => {
                if (err) return reject(err);
                resolve();
              });
            });
          });
        })
        .connect(this.port, this.host, resolve);
    });
  }

  disconnect() {
    this.socket.destroy();
    this.onDisconnect?.();
  }
}
