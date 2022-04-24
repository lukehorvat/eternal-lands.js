/**
 * In this example, we connect and try logging in after several seconds. Once
 * successfully logged in, we send a message to local chat.
 *
 * A heartbeat packet is also sent at regular intervals to keep the connection alive.
 *
 * We also respond to any ping requests that the server makes.
 */

import { ELPackets, ELPacketType } from '../lib';

const username = process.env.EL_USERNAME!;
const password = process.env.EL_PASSWORD!;

(async () => {
  let heartbeatIntervalId: NodeJS.Timer;
  let loginTimeoutId: NodeJS.Timeout;
  let chatTimeoutId: NodeJS.Timeout;

  const elp = new ELPackets({
    onDisconnect: () => {
      console.log('Disconnected!');
      clearInterval(heartbeatIntervalId);
      clearTimeout(loginTimeoutId);
      clearTimeout(chatTimeoutId);
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
    elp.client.emit(ELPacketType.client.HEARTBEAT, {});
    console.log('Sent HEARTBEAT');
  }, 25000);

  elp.server.on(ELPacketType.server.PING_REQUEST, ({ echo }) => {
    console.log('Received PING_REQUEST', { echo });
    elp.client.emit(ELPacketType.client.PING_RESPONSE, { echo });
    console.log('Sent PING_RESPONSE', { echo });
  });

  loginTimeoutId = setTimeout(() => {
    elp.client.emit(ELPacketType.client.LOGIN, { username, password });
    console.log('Sent LOGIN');
  }, 3000);

  elp.server.on(ELPacketType.server.LOGIN_SUCCESSFUL, () => {
    console.log('Received LOGIN_SUCCESSFUL 😎');

    chatTimeoutId = setTimeout(() => {
      const message = 'Hello, world!';
      elp.client.emit(ELPacketType.client.RAW_TEXT, { message });
      console.log('Sent RAW_TEXT', { message });
    }, 3000);

    elp.server.on(ELPacketType.server.RAW_TEXT, ({ channel, message }) => {
      console.log('Received RAW_TEXT', { channel, message });
    });
  });

  elp.server.on(ELPacketType.server.LOGIN_FAILED, () => {
    console.log('Received LOGIN_FAILED 🙁');
  });
})();
