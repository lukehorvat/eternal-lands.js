/**
 * In this example, we connect and try logging in after several seconds. Once
 * successfully logged in, we send a message to local chat.
 *
 * A heartbeat packet is also sent at regular intervals to keep the connection alive.
 *
 * We also respond to any ping requests that the server makes.
 */

import { ELClientPacketType, ELConnection, ELServerPacketType } from '../lib';

const username = process.env.EL_USERNAME!;
const password = process.env.EL_PASSWORD!;

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
  elc.onReceive(ELServerPacketType.LOG_IN_OK, () => {
    setTimeout(() => {
      elc.send(ELClientPacketType.RAW_TEXT, { message: 'Hello, world!' });
    }, 2000);
  });

  setInterval(() => {
    elc.send(ELClientPacketType.HEART_BEAT, {});
  }, 25000);

  setTimeout(() => {
    elc.send(ELClientPacketType.LOG_IN, { username, password });
  }, 3000);
})();
