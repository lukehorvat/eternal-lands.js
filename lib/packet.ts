export class Packet {
  type: number;
  dataBuffer: Buffer;

  constructor(type: number, dataBuffer?: Buffer) {
    this.type = type;
    this.dataBuffer = dataBuffer ?? Buffer.alloc(0);
  }

  toBuffer(): Buffer {
    const typeBuffer = Buffer.alloc(1);
    typeBuffer.writeUInt8(this.type); // 1 byte

    const lengthBuffer = Buffer.alloc(2);
    lengthBuffer.writeUInt16LE(1 + this.dataBuffer.byteLength); // 2 bytes

    return Buffer.concat([typeBuffer, lengthBuffer, this.dataBuffer]);
  }

  static fromBuffer(buffer: Buffer): { packets: Packet[]; partial: Buffer } {
    const packets: Packet[] = [];

    // Is buffer large enough to contain a packet's type and length?
    while (buffer.byteLength >= 3) {
      const type = buffer.readUInt8(0); // 1 byte
      const length = buffer.readUInt16LE(1); // 2 bytes
      const dataBuffer = buffer.slice(3, 3 + length - 1);

      // Is buffer too small to contain a packet's data?
      if (dataBuffer.byteLength < length - 1) {
        break;
      }

      packets.push(new Packet(type, dataBuffer));
      buffer = buffer.slice(3 + length - 1);
    }

    return { packets, partial: buffer };
  }
}
