import {
  ClientPacketEventEmitter,
  ServerPacketEventEmitter,
} from '../lib/events';
import { ClientPacketDataParsers, ClientPacketType } from '../lib/data/client';
import { ServerPacketDataParsers, ServerPacketType } from '../lib/data/server';
import { Packet } from '../lib/data/packets';
import { ChatChannel } from '../lib/constants';

describe('ClientPacketEventEmitter', () => {
  test('Sends packets when emit() is called', async () => {
    const sendPacketMock = jest.fn();
    const eventEmitter = new ClientPacketEventEmitter(sendPacketMock);

    await eventEmitter.emit(ClientPacketType.HEART_BEAT, {});
    await eventEmitter.emit(ClientPacketType.PING, { echo: 123 });
    await eventEmitter.emit(ClientPacketType.PING_RESPONSE, { echo: 321 });

    expect(sendPacketMock).toBeCalledTimes(3);
    expect(sendPacketMock).nthCalledWith(
      1,
      new Packet(
        ClientPacketType.HEART_BEAT,
        ClientPacketDataParsers[ClientPacketType.HEART_BEAT].toBuffer({})
      )
    );
    expect(sendPacketMock).nthCalledWith(
      2,
      new Packet(
        ClientPacketType.PING,
        ClientPacketDataParsers[ClientPacketType.PING].toBuffer({ echo: 123 })
      )
    );
    expect(sendPacketMock).nthCalledWith(
      3,
      new Packet(
        ClientPacketType.PING_RESPONSE,
        ClientPacketDataParsers[ClientPacketType.PING_RESPONSE].toBuffer({
          echo: 321,
        })
      )
    );
  });

  test('Throws an error when emit() is called with an unsupported packet type', async () => {
    const sendPacketMock = jest.fn();
    const eventEmitter = new ClientPacketEventEmitter(sendPacketMock);

    await expect(
      eventEmitter.emit(
        -42 as never // A packet type that would never be supported.
      )
    ).rejects.toThrow('Unsupported packet type');

    expect(sendPacketMock).toBeCalledTimes(0);
  });
});

describe('ServerPacketEventEmitter', () => {
  test('Triggers emit() when packets are received', () => {
    const eventEmitter = new ServerPacketEventEmitter();
    const emitSpy = jest.spyOn(eventEmitter, 'emit');

    eventEmitter.receivePacket(
      new Packet(
        ServerPacketType.RAW_TEXT,
        ServerPacketDataParsers[ServerPacketType.RAW_TEXT].toBuffer({
          channel: ChatChannel.LOCAL,
          message: 'test',
        })
      )
    );
    eventEmitter.receivePacket(
      new Packet(
        ServerPacketType.PONG,
        ServerPacketDataParsers[ServerPacketType.PONG].toBuffer({ echo: 123 })
      )
    );
    eventEmitter.receivePacket(
      new Packet(
        ServerPacketType.PING_REQUEST,
        ServerPacketDataParsers[ServerPacketType.PING_REQUEST].toBuffer({
          echo: 321,
        })
      )
    );

    expect(emitSpy).toBeCalledTimes(3);
    expect(emitSpy).nthCalledWith(1, ServerPacketType.RAW_TEXT, {
      channel: ChatChannel.LOCAL,
      message: 'test',
    });
    expect(emitSpy).nthCalledWith(2, ServerPacketType.PONG, { echo: 123 });
    expect(emitSpy).nthCalledWith(3, ServerPacketType.PING_REQUEST, {
      echo: 321,
    });
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
    expect(emitSpy).nthCalledWith(1, 'UNSUPPORTED', packet);
  });
});
