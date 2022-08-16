/**
 * In this example, we connect and try sending a ping after several seconds.
 *
 * A heartbeat packet is also sent at regular intervals to keep the connection alive.
 *
 * We also respond to any ping requests that the server makes.
 */

import * as EL from 'eternal-lands.js';

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

  setInterval(() => {
    client.send(EL.ClientPacketType.HEART_BEAT, {});
  }, 25000);

  setTimeout(() => {
    client.send(EL.ClientPacketType.PING, {
      echo: Buffer.from([0x01, 0x02, 0x03, 0x04]),
    });
  }, 3000);
})();
