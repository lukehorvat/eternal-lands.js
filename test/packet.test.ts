import { BufferReader } from 'easy-buffer';
import { Packet } from '../lib/data/packets';

describe('toBuffer()', () => {
  test('Handles packet with no data', () => {
    const packet = new Packet(123);
    const reader = new BufferReader(packet.toBuffer());

    expect(reader.bufferRemaining().length).toBe(3); // type + length
    expect(reader.read({ type: 'UInt8' })).toBe(123); // type
    expect(reader.read({ type: 'UInt16LE' })).toBe(1); // length
  });

  test('Handles packet with data', () => {
    const packet = new Packet(123, Buffer.from('test', 'ascii'));
    const reader = new BufferReader(packet.toBuffer());

    expect(reader.bufferRemaining().length).toBe(7); // type + length + data
    expect(reader.read({ type: 'UInt8' })).toBe(123); // type
    expect(reader.read({ type: 'UInt16LE' })).toBe(5); // length
    expect(reader.read({ type: 'String', encoding: 'ascii' })).toBe('test'); // data
  });
});

describe('fromBuffer()', () => {
  test('Handles buffer containing complete packets', () => {
    const { packets, partial } = Packet.fromBuffer(
      Buffer.concat(
        [
          new Packet(10, Buffer.from('AAA', 'ascii')),
          new Packet(20, Buffer.from('BBB', 'ascii')),
          new Packet(30, Buffer.from('CCC', 'ascii')),
        ].map((packet) => packet.toBuffer())
      )
    );

    expect(packets.length).toBe(3);
    expect(packets[0].type).toBe(10);
    expect(packets[0].dataBuffer.toString('ascii')).toBe('AAA');
    expect(packets[1].type).toBe(20);
    expect(packets[1].dataBuffer.toString('ascii')).toBe('BBB');
    expect(packets[2].type).toBe(30);
    expect(packets[2].dataBuffer.toString('ascii')).toBe('CCC');
    expect(partial.length).toBe(0);
  });

  test('Handles buffer containing a partial packet (data omitted)', () => {
    const packet = new Packet(123, Buffer.from('AAA', 'ascii'));
    const { packets, partial } = Packet.fromBuffer(
      packet.toBuffer().subarray(0, 3) // Omit packet data
    );

    expect(packets.length).toBe(0);
    expect(partial.length).toBe(3);
    expect(partial.readUInt8(0)).toBe(123);
    expect(partial.readUInt16LE(1)).toBe(4);
  });

  test('Handles buffer containing a partial packet (length and data omitted)', () => {
    const packet = new Packet(123, Buffer.from('AAA', 'ascii'));
    const { packets, partial } = Packet.fromBuffer(
      packet.toBuffer().subarray(0, 1) // Omit packet length and data
    );

    expect(packets.length).toBe(0);
    expect(partial.length).toBe(1);
    expect(partial.readUInt8(0)).toBe(123);
  });

  test('Handles buffer containing both complete packets and a partial packet', () => {
    const { packets, partial } = Packet.fromBuffer(
      Buffer.concat([
        new Packet(10, Buffer.from('AAA', 'ascii')).toBuffer(),
        new Packet(20, Buffer.from('BBB', 'ascii')).toBuffer(),
        new Packet(30, Buffer.from('CCC', 'ascii')).toBuffer().subarray(0, 3), // Omit packet data
      ])
    );

    expect(packets.length).toBe(2);
    expect(packets[0].type).toBe(10);
    expect(packets[0].dataBuffer.toString('ascii')).toBe('AAA');
    expect(packets[1].type).toBe(20);
    expect(packets[1].dataBuffer.toString('ascii')).toBe('BBB');
    expect(partial.length).toBe(3);
    expect(partial.readUInt8(0)).toBe(30);
    expect(partial.readUInt16LE(1)).toBe(4);
  });
});
