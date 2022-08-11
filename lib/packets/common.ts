import { BufferReader, BufferWriter } from 'easy-buffer';

export type PacketType = number;
export type PopulatedPacketData = Record<string, any>;
export type EmptyPacketData = Record<string, never>;
export type PacketData = PopulatedPacketData | EmptyPacketData;

export class PacketWithBufferedData {
  readonly type: PacketType;
  readonly dataBuffer: Buffer;

  constructor(type: PacketType, dataBuffer: Buffer) {
    this.type = type;
    this.dataBuffer = dataBuffer;
  }
}

export class PacketWithParsedData<
  Type extends PacketType,
  Data extends PacketData
> {
  readonly type: Type;
  readonly data: Data;

  constructor(type: Type, data: Data) {
    this.type = type;
    this.data = data;
  }
}

export interface PacketDataParser<Data extends PacketData> {
  fromBuffer(dataBuffer: Buffer): Data;
  toBuffer(data: Data): Buffer;
}

export const EmptyPacketDataParser: PacketDataParser<EmptyPacketData> = {
  fromBuffer() {
    return {};
  },

  toBuffer() {
    return Buffer.alloc(0);
  },
};

export function readPacketsFromBuffer<
  Type extends PacketType,
  Data extends PacketData,
  Packet extends PacketWithParsedData<Type, Data>
>(
  buffer: Buffer,
  parsePacketData: (packet: PacketWithBufferedData) => Packet
): {
  packets: Packet[];
  remainingBuffer: Buffer;
} {
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
    packets.push(parsePacketData(new PacketWithBufferedData(type, dataBuffer)));

    buffer = reader.bufferRemaining();
  }

  return { packets, remainingBuffer: buffer };
}

export function writePacketsToBuffer<
  Type extends PacketType,
  Data extends PacketData,
  Packet extends PacketWithParsedData<Type, Data>
>(
  packets: Packet[],
  bufferPacketData: (packet: Packet) => PacketWithBufferedData
): Buffer {
  return Buffer.concat(
    packets.map(bufferPacketData).map((packet) => {
      return new BufferWriter()
        .write({ type: 'UInt8', value: packet.type })
        .write({ type: 'UInt16LE', value: packet.dataBuffer.length + 1 })
        .write({ type: 'Buffer', value: packet.dataBuffer })
        .buffer();
    })
  );
}
