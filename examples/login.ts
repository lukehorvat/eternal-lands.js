/**
 * In this example, we connect and try logging in after several seconds. Once
 * successfully logged in, we send a message to local chat.
 *
 * A heartbeat packet is also sent at regular intervals to keep the connection alive.
 *
 * We also respond to any ping requests that the server makes.
 */

import * as EL from '../lib';

const username = process.env.EL_USERNAME!;
const password = process.env.EL_PASSWORD!;

(async () => {
  const elc = new EL.Client();

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
    console.log('Sent', EL.ClientPacketType[type], data);
  });
  elc.onReceiveAny((type, data) => {
    console.log('Received', EL.ServerPacketType[type], data);
  });
  elc.onReceive(EL.ServerPacketType.PING_REQUEST, (data) => {
    elc.send(EL.ClientPacketType.PING_RESPONSE, data);
  });
  elc.onReceive(EL.ServerPacketType.LOG_IN_OK, () => {
    setTimeout(() => {
      elc.send(EL.ClientPacketType.RAW_TEXT, { message: 'Hello, world!' });
    }, 2000);
  });

  setInterval(() => {
    elc.send(EL.ClientPacketType.HEART_BEAT, {});
  }, 25000);

  setTimeout(() => {
    elc.send(EL.ClientPacketType.LOG_IN, { username, password });
  }, 3000);
})();
