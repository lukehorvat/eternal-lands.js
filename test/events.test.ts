import {
  ClientPacketEventEmitter,
  ServerPacketEventEmitter,
} from '../lib/events';
import { packetDataParsers } from '../lib/data';
import { ClientPacketType, ServerPacketType } from '../lib/types';
import { Packet } from '../lib/packet';
import { ChatChannel } from '../lib/constants';

describe('ClientPacketEventEmitter', () => {
  test('Sends packets when emit() is called', () => {
    const sendPacketMock = jest.fn();
    const eventEmitter = new ClientPacketEventEmitter(sendPacketMock);

    eventEmitter.emit(ClientPacketType.HEARTBEAT);
    eventEmitter.emit(ClientPacketType.PING, 123);
    eventEmitter.emit(ClientPacketType.PING_RESPONSE, 321);

    expect(sendPacketMock).toBeCalledTimes(3);
    expect(sendPacketMock).nthCalledWith(
      1,
      new Packet(
        ClientPacketType.HEARTBEAT,
        packetDataParsers.client[ClientPacketType.HEARTBEAT].toBuffer()
      )
    );
    expect(sendPacketMock).nthCalledWith(
      2,
      new Packet(
        ClientPacketType.PING,
        packetDataParsers.client[ClientPacketType.PING].toBuffer(123)
      )
    );
    expect(sendPacketMock).nthCalledWith(
      3,
      new Packet(
        ClientPacketType.PING_RESPONSE,
        packetDataParsers.client[ClientPacketType.PING_RESPONSE].toBuffer(321)
      )
    );
  });

  test('Triggers on() when emit() is called', () => {
    const onMock = jest.fn();
    const eventEmitter = new ClientPacketEventEmitter(() => {});

    eventEmitter.on(ClientPacketType.HEARTBEAT, onMock);
    eventEmitter.on(ClientPacketType.PING, onMock);
    eventEmitter.on(ClientPacketType.PING_RESPONSE, onMock);
    eventEmitter.emit(ClientPacketType.HEARTBEAT);
    eventEmitter.emit(ClientPacketType.PING, 123);
    eventEmitter.emit(ClientPacketType.PING_RESPONSE, 321);

    expect(onMock).toBeCalledTimes(3);
    expect(onMock).nthCalledWith(1);
    expect(onMock).nthCalledWith(2, 123);
    expect(onMock).nthCalledWith(3, 321);
  });

  test('Throws an error when emit() is called with an unsupported packet type', () => {
    const sendPacketMock = jest.fn();
    const eventEmitter = new ClientPacketEventEmitter(sendPacketMock);

    expect(() => {
      eventEmitter.emit(-42 /* A packet type that would never be supported. */);
    }).toThrow('Unsupported packet type');
    expect(sendPacketMock).toBeCalledTimes(0);
  });
});

describe('ServerPacketEventEmitter', () => {
  test('Triggers emit() when packets are received', () => {
    const eventEmitter = new ServerPacketEventEmitter();
    const emitSpy = jest.spyOn(eventEmitter, 'emit');

    eventEmitter.receivePacket(
      new Packet(
        ServerPacketType.CHAT,
        packetDataParsers.server[ServerPacketType.CHAT].toBuffer(
          ChatChannel.LOCAL,
          'test'
        )
      )
    );
    eventEmitter.receivePacket(
      new Packet(
        ServerPacketType.PONG,
        packetDataParsers.server[ServerPacketType.PONG].toBuffer(123)
      )
    );
    eventEmitter.receivePacket(
      new Packet(
        ServerPacketType.PING_REQUEST,
        packetDataParsers.server[ServerPacketType.PING_REQUEST].toBuffer(321)
      )
    );

    expect(emitSpy).toBeCalledTimes(3);
    expect(emitSpy).nthCalledWith(
      1,
      ServerPacketType.CHAT,
      ChatChannel.LOCAL,
      'test'
    );
    expect(emitSpy).nthCalledWith(2, ServerPacketType.PONG, 123);
    expect(emitSpy).nthCalledWith(3, ServerPacketType.PING_REQUEST, 321);
  });

  test('Triggers a special emit() when unsupported packets are received', () => {
    const eventEmitter = new ServerPacketEventEmitter();
    const emitSpy = jest.spyOn(eventEmitter, 'emit');
    const packet = new Packet(
      -42, // A packet type that would never be supported.
      Buffer.from('test', 'utf8')
    );
    eventEmitter.receivePacket(packet);

    expect(emitSpy).toBeCalledTimes(1);
    expect(emitSpy).nthCalledWith(1, 'unsupported', packet);
  });
});
