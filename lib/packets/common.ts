import { BufferReader, BufferWriter } from 'easy-buffer';

export type PacketType = number;
export type PopulatedPacketData = Record<string, any>;
export type EmptyPacketData = Record<string, never>;
export type PacketData = PopulatedPacketData | EmptyPacketData;

/**
 * Class representing a packet with a parsed type, but a data buffer that has
 * not been parsed yet. Essentially, an "intermediate" packet form.
 *
 * raw buffer -> packet with buffered data (YOU ARE HERE) -> packet with parsed data
 */
export class PacketWithBufferedData {
  readonly type: PacketType;
  readonly dataBuffer: Buffer;

  constructor(type: PacketType, dataBuffer: Buffer) {
    this.type = type;
    this.dataBuffer = dataBuffer;
  }
}

/**
 * Class representing a packet with a parsed type and data.
 *
 * raw buffer -> packet with buffered data -> packet with parsed data (YOU ARE HERE)
 */
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

/**
 * Interface to describe an object that is capable of transforming a packet's
 * data from "unparsed" (a buffer) to "parsed" (a JS object literal), and vice
 * versa.
 */
export interface PacketDataParser<Data extends PacketData> {
  fromBuffer(dataBuffer: Buffer): Data;
  toBuffer(data: Data): Buffer;
}

/**
 * For packets that do not have data to parse/unparse, this PacketDataParser can
 * be used.
 */
export const EmptyPacketDataParser: PacketDataParser<EmptyPacketData> = {
  fromBuffer() {
    return {};
  },

  toBuffer() {
    return Buffer.alloc(0);
  },
};

/**
 * A utility function to read packets from a buffer.
 *
 * The `parsePacketData` parameter dictates how each packet's data is parsed.
 */
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

/**
 * A utility function to write packets to a buffer.
 *
 * The `bufferPacketData` parameter dictates how each packet's data is buffered.
 */
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
