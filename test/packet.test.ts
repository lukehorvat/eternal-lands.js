import { Packet } from '../lib/packet';

describe('toBuffer()', () => {
  test('Handles packet with no data', () => {
    const packet = new Packet(123);
    const buffer = packet.toBuffer();

    expect(buffer.byteLength).toBe(3); // type + length
    expect(buffer.readUInt8(0)).toBe(123); // type
    expect(buffer.readUInt16LE(1)).toBe(1); // length
  });

  test('Handles packet with data', () => {
    const packet = new Packet(123, Buffer.from('test', 'ascii'));
    const buffer = packet.toBuffer();

    expect(buffer.byteLength).toBe(7); // type + length + data
    expect(buffer.readUInt8(0)).toBe(123); // type
    expect(buffer.readUInt16LE(1)).toBe(5); // length
    expect(buffer.toString('ascii', 3)).toBe('test'); // data
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
    expect(partial.byteLength).toBe(0);
  });

  test('Handles buffer containing a partial packet (data omitted)', () => {
    const packet = new Packet(123, Buffer.from('AAA', 'ascii'));
    const { packets, partial } = Packet.fromBuffer(
      packet.toBuffer().slice(0, 3) // Omit packet data
    );

    expect(packets.length).toBe(0);
    expect(partial.byteLength).toBe(3);
    expect(partial.readUInt8(0)).toBe(123);
    expect(partial.readUInt16LE(1)).toBe(4);
  });

  test('Handles buffer containing a partial packet (length and data omitted)', () => {
    const packet = new Packet(123, Buffer.from('AAA', 'ascii'));
    const { packets, partial } = Packet.fromBuffer(
      packet.toBuffer().slice(0, 1) // Omit packet length and data
    );

    expect(packets.length).toBe(0);
    expect(partial.byteLength).toBe(1);
    expect(partial.readUInt8(0)).toBe(123);
  });

  test('Handles buffer containing both complete packets and a partial packet', () => {
    const { packets, partial } = Packet.fromBuffer(
      Buffer.concat([
        new Packet(10, Buffer.from('AAA', 'ascii')).toBuffer(),
        new Packet(20, Buffer.from('BBB', 'ascii')).toBuffer(),
        new Packet(30, Buffer.from('CCC', 'ascii')).toBuffer().slice(0, 3), // Omit packet data
      ])
    );

    expect(packets.length).toBe(2);
    expect(packets[0].type).toBe(10);
    expect(packets[0].dataBuffer.toString('ascii')).toBe('AAA');
    expect(packets[1].type).toBe(20);
    expect(packets[1].dataBuffer.toString('ascii')).toBe('BBB');
    expect(partial.byteLength).toBe(3);
    expect(partial.readUInt8(0)).toBe(30);
    expect(partial.readUInt16LE(1)).toBe(4);
  });
});
