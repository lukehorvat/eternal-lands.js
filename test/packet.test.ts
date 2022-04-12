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
    const packet = new Packet(123, Buffer.from('test', 'utf8'));
    const buffer = packet.toBuffer();

    expect(buffer.byteLength).toBe(7); // type + length + data
    expect(buffer.readUInt8(0)).toBe(123); // type
    expect(buffer.readUInt16LE(1)).toBe(5); // length
    expect(buffer.toString('utf8', 3)).toBe('test'); // data
  });
});

describe('fromBuffer()', () => {
  test('Handles buffer containing complete packets', () => {
    const { packets, partial } = Packet.fromBuffer(
      Buffer.concat(
        [
          new Packet(10, Buffer.from('AAA', 'utf8')),
          new Packet(20, Buffer.from('BBB', 'utf8')),
          new Packet(30, Buffer.from('CCC', 'utf8')),
        ].map((packet) => packet.toBuffer())
      )
    );

    expect(packets.length).toBe(3);
    expect(packets[0].type).toBe(10);
    expect(packets[0].data.toString('utf8')).toBe('AAA');
    expect(packets[1].type).toBe(20);
    expect(packets[1].data.toString('utf8')).toBe('BBB');
    expect(packets[2].type).toBe(30);
    expect(packets[2].data.toString('utf8')).toBe('CCC');
    expect(partial.byteLength).toBe(0);
  });

  test('Handles buffer containing a partial packet (data omitted)', () => {
    const packet = new Packet(123, Buffer.from('AAA', 'utf8'));
    const { packets, partial } = Packet.fromBuffer(
      packet.toBuffer().slice(0, 3) // Omit packet data
    );

    expect(packets.length).toBe(0);
    expect(partial.byteLength).toBe(3);
    expect(partial.readUInt8(0)).toBe(123);
    expect(partial.readUInt16LE(1)).toBe(4);
  });

  test('Handles buffer containing a partial packet (length and data omitted)', () => {
    const packet = new Packet(123, Buffer.from('AAA', 'utf8'));
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
        new Packet(10, Buffer.from('AAA', 'utf8')).toBuffer(),
        new Packet(20, Buffer.from('BBB', 'utf8')).toBuffer(),
        new Packet(30, Buffer.from('CCC', 'utf8')).toBuffer().slice(0, 3), // Omit packet data
      ])
    );

    expect(packets.length).toBe(2);
    expect(packets[0].type).toBe(10);
    expect(packets[0].data.toString('utf8')).toBe('AAA');
    expect(packets[1].type).toBe(20);
    expect(packets[1].data.toString('utf8')).toBe('BBB');
    expect(partial.byteLength).toBe(3);
    expect(partial.readUInt8(0)).toBe(30);
    expect(partial.readUInt16LE(1)).toBe(4);
  });
});
