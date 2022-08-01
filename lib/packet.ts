import { BufferReader, BufferWriter } from 'easy-buffer';

export class Packet {
  type: number;
  dataBuffer: Buffer;

  constructor(type: number, dataBuffer?: Buffer) {
    this.type = type;
    this.dataBuffer = dataBuffer ?? Buffer.alloc(0);
  }

  toBuffer(): Buffer {
    return new BufferWriter()
      .write({ type: 'UInt8', value: this.type })
      .write({ type: 'UInt16LE', value: this.dataBuffer.length + 1 })
      .write({ type: 'Buffer', value: this.dataBuffer })
      .buffer();
  }

  static fromBuffer(buffer: Buffer): { packets: Packet[]; partial: Buffer } {
    const packets: Packet[] = [];

    // Is buffer large enough to contain a packet's type and length?
    while (buffer.length >= 3) {
      const reader = new BufferReader(buffer);
      const type = reader.read({ type: 'UInt8' });
      const length = reader.read({ type: 'UInt16LE' }) - 1;

      // Is buffer too small to contain a packet's data?
      if (length > reader.bufferRemaining().length) {
        break;
      }

      const dataBuffer = reader.read({ type: 'Buffer', length });
      packets.push(new Packet(type, dataBuffer));
      buffer = reader.bufferRemaining();
    }

    return { packets, partial: buffer };
  }
}
