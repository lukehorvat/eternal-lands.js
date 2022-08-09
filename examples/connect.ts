/**
 * In this example, we connect and try sending a ping after several seconds.
 *
 * A heartbeat packet is also sent at regular intervals to keep the connection alive.
 *
 * We also respond to any ping requests that the server makes.
 */

import { ELClientPacketType, ELConnection, ELServerPacketType } from '../lib';

(async () => {
  const elc = new ELConnection();

  try {
    await elc.connect();
    console.log('Connected!');
  } catch (err) {
    console.log('Failed to connect!');
    process.exit(1);
  }

  elc.onDisconnect(() => {
    console.log('Disconnected!');
    process.exit(1);
  });
  elc.onSendAny((type, data) => {
    console.log('Sent', ELClientPacketType[type], data);
  });
  elc.onReceiveAny((type, data) => {
    console.log('Received', ELServerPacketType[type], data);
  });
  elc.onReceive(ELServerPacketType.PING_REQUEST, (data) => {
    elc.send(ELClientPacketType.PING_RESPONSE, data);
  });

  setInterval(() => {
    elc.send(ELClientPacketType.HEART_BEAT, {});
  }, 25000);

  setTimeout(() => {
    elc.send(ELClientPacketType.PING, {
      echo: Buffer.from([0x01, 0x02, 0x03, 0x04]),
    });
  }, 3000);
})();
