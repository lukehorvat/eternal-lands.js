import { ELPackets, ELPacketType } from '../lib';

(async () => {
  const elp = new ELPackets();

  try {
    await elp.connect();
    console.log('Connected!');
  } catch (err) {
    console.log('Failed to connect!');
    process.exit(1);
  }

  elp.server.on(ELPacketType.server.UNSUPPORTED, (type) => {
    console.log('<< Received unsupported packet', { type });
  });

  elp.server.on(ELPacketType.server.PONG, (echo) => {
    console.log('<< Received pong', { echo });
  });

  elp.server.on(ELPacketType.server.CHAT, (channel, message) => {
    console.log('<< Received chat', { channel, message });
  });

  setTimeout(() => {
    elp.client.emit(ELPacketType.client.PING, 123);
    console.log('>> Sent ping');
  }, 2000);

  setInterval(() => {
    elp.client.emit(ELPacketType.client.HEARTBEAT);
    console.log('>> Sent heartbeat');
  }, 25000);
})();
