import { Connection } from './connection';
import { ClientPacketType, ServerPacketType } from './types';

const username = process.env.EL_USERNAME;
const password = process.env.EL_PASSWORD;

(async () => {
  const connection = new Connection();

  try {
    await connection.open();
    console.log('Connected!');
  } catch (err) {
    console.log('Failed to connect!');
    process.exit(1);
  }

  connection.serverPackets.on(ServerPacketType.UNSUPPORTED, (type) => {
    console.log('<< Received unsupported packet', { type });
  });

  connection.serverPackets.on(ServerPacketType.PONG, (echo) => {
    console.log('<< Received pong', { echo });
  });

  connection.serverPackets.on(ServerPacketType.CHAT, (channel, message) => {
    console.log('<< Received chat', { channel, message });
  });

  setTimeout(() => {
    connection.clientPackets.emit(ClientPacketType.PING, 123);
    console.log('>> Sent ping');
  }, 2000);

  setInterval(() => {
    connection.clientPackets.emit(ClientPacketType.HEARTBEAT);
    console.log('>> Sent heartbeat');
  }, 25000);
})();
