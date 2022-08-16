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
  const client = new EL.Client();

  try {
    await client.connect();
    console.log('Connected!');
  } catch (err) {
    console.log('Failed to connect!');
    process.exit(1);
  }

  client.onDisconnect(() => {
    console.log('Disconnected!');
    process.exit(1);
  });
  client.onSendAny((type, data) => {
    console.log('Sent', EL.ClientPacketType[type], data);
  });
  client.onReceiveAny((type, data) => {
    console.log('Received', EL.ServerPacketType[type], data);
  });
  client.onReceive(EL.ServerPacketType.PING_REQUEST, (data) => {
    client.send(EL.ClientPacketType.PING_RESPONSE, data);
  });
  client.onReceive(EL.ServerPacketType.LOG_IN_OK, () => {
    setTimeout(() => {
      client.send(EL.ClientPacketType.RAW_TEXT, { message: 'Hello, world!' });
    }, 2000);
  });

  setInterval(() => {
    client.send(EL.ClientPacketType.HEART_BEAT, {});
  }, 25000);

  setTimeout(() => {
    client.send(EL.ClientPacketType.LOG_IN, { username, password });
  }, 3000);
})();
