import { ELPackets, ELPacketType } from '../lib';

(async () => {
  const elp = new ELPackets();
  let pingTimeoutId: NodeJS.Timeout;
  let heartbeatIntervalId: NodeJS.Timer;

  try {
    await elp.connect({
      onDisconnect: () => {
        console.log('Disconnected!');
        clearTimeout(pingTimeoutId);
        clearInterval(heartbeatIntervalId);
      },
    });
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

  elp.server.on(ELPacketType.server.PING_REQUEST, (echo) => {
    console.log('<< Received ping request', { echo });
    elp.client.emit(ELPacketType.client.PING_RESPONSE, echo);
    console.log('>> Sent ping response');
  });

  elp.server.on(ELPacketType.server.CHAT, (channel, message) => {
    console.log('<< Received chat', { channel, message });
  });

  pingTimeoutId = setTimeout(() => {
    elp.client.emit(ELPacketType.client.PING, 123);
    console.log('>> Sent ping');
  }, 3000);

  heartbeatIntervalId = setInterval(() => {
    elp.client.emit(ELPacketType.client.HEARTBEAT);
    console.log('>> Sent heartbeat');
  }, 25000);
})();
