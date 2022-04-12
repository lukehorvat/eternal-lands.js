export class Packet {
  type: number;
  data: Buffer;

  constructor(type: number, data?: Buffer) {
    this.type = type;
    this.data = data ?? Buffer.alloc(0);
  }

  toBuffer(): Buffer {
    const type = Buffer.alloc(1);
    type.writeUInt8(this.type); // 1 byte

    const length = Buffer.alloc(2);
    length.writeUInt16LE(type.byteLength + this.data.byteLength); // 2 bytes

    return Buffer.concat([type, length, this.data]);
  }

  static fromBuffer(buffer: Buffer): { packets: Packet[]; partial: Buffer } {
    const packets: Packet[] = [];

    // Is buffer large enough to contain a packet's type and length?
    while (buffer.byteLength >= 3) {
      const type = buffer.readUInt8(0); // 1 byte
      const length = buffer.readUInt16LE(1); // 2 bytes
      const data = buffer.slice(3, 3 + length - 1);

      // Is buffer too small to contain a packet's data?
      if (data.byteLength < length - 1) {
        break;
      }

      packets.push(new Packet(type, data));
      buffer = buffer.slice(3 + length - 1);
    }

    return { packets, partial: buffer };
  }
}
