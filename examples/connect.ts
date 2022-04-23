/**
 * In this example, we connect and try sending a ping after several seconds.
 *
 * A heartbeat packet is also sent at regular intervals to keep the connection alive.
 *
 * We also respond to any ping requests that the server makes.
 */

import { ELPackets, ELPacketType } from '../lib';

(async () => {
  let heartbeatIntervalId: NodeJS.Timer;
  let pingTimeoutId: NodeJS.Timeout;

  const elp = new ELPackets({
    onDisconnect: () => {
      console.log('Disconnected!');
      clearInterval(heartbeatIntervalId);
      clearTimeout(pingTimeoutId);
    },
  });

  try {
    await elp.connect();
    console.log('Connected!');
  } catch (err) {
    console.log('Failed to connect!');
    process.exit(1);
  }

  heartbeatIntervalId = setInterval(() => {
    elp.client.emit(ELPacketType.client.HEARTBEAT, []);
    console.log('Sent HEARTBEAT');
  }, 25000);

  elp.server.on(ELPacketType.server.PING_REQUEST, ([echo]) => {
    console.log('Received PING_REQUEST', { echo });
    elp.client.emit(ELPacketType.client.PING_RESPONSE, [echo]);
    console.log('Sent PING_RESPONSE', { echo });
  });

  pingTimeoutId = setTimeout(() => {
    const echo = 123;
    elp.client.emit(ELPacketType.client.PING, [echo]);
    console.log('Sent PING', { echo });
  }, 5000);

  elp.server.on(ELPacketType.server.PONG, ([echo]) => {
    console.log('Received PONG', { echo });
  });
})();
