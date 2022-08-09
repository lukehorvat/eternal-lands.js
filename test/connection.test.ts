import { Connection } from '../lib/connection';
import { ClientPacketType } from '../lib/data/client';
import { ServerPacketType } from '../lib/data/server';
import { MockELServer } from './util/mock-server';

let server: MockELServer;
let connection: Connection;

beforeEach(() => {
  server = new MockELServer({ port: 8000 });
  connection = new Connection({ host: 'localhost', port: 8000 });
});

afterEach(async () => {
  if (connection.isConnected) {
    await connection.disconnect();
  }

  await server.stop();
});

test('Can connect, disconnect, and reconnect', async () => {
  await server.start();

  const onConnectMock = jest.fn();
  const onDisconnectMock = jest.fn();
  connection.onConnect(onConnectMock);
  connection.onDisconnect(onDisconnectMock);

  // Connect
  expect(onConnectMock).toBeCalledTimes(0);
  expect(connection.isConnected).toBe(false);
  await connection.connect();
  expect(onConnectMock).toBeCalledTimes(1);
  expect(connection.isConnected).toBe(true);

  // Disconnect
  expect(onDisconnectMock).toBeCalledTimes(0);
  await connection.disconnect();
  expect(onDisconnectMock).toBeCalledTimes(1);
  expect(connection.isConnected).toBe(false);

  // Connect again
  await connection.connect();
  expect(onConnectMock).toBeCalledTimes(2);
  expect(connection.isConnected).toBe(true);

  // Disconnect again
  await connection.disconnect();
  expect(onDisconnectMock).toBeCalledTimes(2);
  expect(connection.isConnected).toBe(false);
});

test(`Throws an error when it can't connect`, async () => {
  // Try to connect even though the server isn't started
  await expect(connection.connect()).rejects.toThrow();

  await server.start();

  // Just to check if it can recover, try to connect again now that the server is started
  await connection.connect();
});

test(`Throws an error when attempting to connect whilst already connected`, async () => {
  await server.start();

  await connection.connect();
  await expect(connection.connect()).rejects.toMatch('Already connected!');
});

test(`Throws an error when attempting to connect whilst already in the process of connecting`, async () => {
  await server.start();

  // Start connecting (note the lack of await)
  const promise = connection.connect();

  // Now try to connect again while the previous promise is unresolved
  await expect(connection.connect()).rejects.toMatch(
    'Already in the process of connecting!'
  );

  await promise;
});

test(`Throws an error when attempting to disconnect whilst already disconnected`, async () => {
  await expect(connection.disconnect()).rejects.toMatch(
    'Already disconnected!'
  );

  await server.start();
  await connection.connect();

  await connection.disconnect();
  await expect(connection.disconnect()).rejects.toMatch(
    'Already disconnected!'
  );
});

test(`Throws an error when attempting to disconnect whilst in the process of connecting`, async () => {
  await server.start();

  // Start connecting (note the lack of await)
  const promise = connection.connect();

  await expect(connection.disconnect()).rejects.toMatch(
    'Cannot disconnect whilst in the process of connecting!'
  );

  await promise;
});

test(`Throws an error when attempting to connect whilst in the process of disconnecting`, async () => {
  await server.start();
  await connection.connect();

  // Start disconnecting (note the lack of await)
  const promise = connection.disconnect();

  await expect(connection.connect()).rejects.toMatch(
    'Cannot connect whilst in the process of disconnecting!'
  );

  await promise;
});

test(`Throws an error when attempting to send packets whilst disconnected`, async () => {
  await expect(
    connection.send(ClientPacketType.RAW_TEXT, {
      message: 'test',
    })
  ).rejects.toMatch('Cannot send packets when disconnected!');
});

test('Can send and receive packets whilst connected', async () => {
  await server.start();
  await connection.connect();

  // Setup listeners
  const onSendLoginMock = jest.fn();
  const onSendPingMock = jest.fn();
  const onSendAnyMock = jest.fn();
  const onReceiveLoginFailMock = jest.fn();
  const onReceiveLoginSuccessMock = jest.fn();
  const onReceivePongMock = jest.fn();
  const onReceiveAnyMock = jest.fn();
  connection.onSend(ClientPacketType.LOG_IN, onSendLoginMock);
  connection.onSend(ClientPacketType.PING, onSendPingMock);
  connection.onSendAny(onSendAnyMock);
  connection.onReceive(ServerPacketType.LOG_IN_NOT_OK, onReceiveLoginFailMock);
  connection.onReceive(ServerPacketType.LOG_IN_OK, onReceiveLoginSuccessMock);
  connection.onReceive(ServerPacketType.PONG, onReceivePongMock);
  connection.onReceiveAny(onReceiveAnyMock);

  // Send login packet with incorrect credentials.
  const badLoginRequest = { username: 'Test', password: 'bad_password' };
  connection.send(ClientPacketType.LOG_IN, badLoginRequest);
  await expect(
    connection.onSendOnce(ClientPacketType.LOG_IN)
  ).resolves.toStrictEqual(badLoginRequest);
  expect(onSendLoginMock).lastCalledWith(badLoginRequest);
  expect(onSendAnyMock).lastCalledWith(
    ClientPacketType.LOG_IN,
    badLoginRequest
  );

  // Receive failed login packet.
  const badLoginResponse = { reason: 'Wrong password.' };
  await expect(
    connection.onReceiveOnce(ServerPacketType.LOG_IN_NOT_OK)
  ).resolves.toStrictEqual(badLoginResponse);
  expect(onReceiveLoginFailMock).lastCalledWith(badLoginResponse);
  expect(onReceiveAnyMock).lastCalledWith(
    ServerPacketType.LOG_IN_NOT_OK,
    badLoginResponse
  );

  // Send login packet with correct credentials.
  const goodLoginRequest = { username: 'Test', password: 'good_password' };
  connection.send(ClientPacketType.LOG_IN, goodLoginRequest);
  await expect(
    connection.onSendOnce(ClientPacketType.LOG_IN)
  ).resolves.toStrictEqual(goodLoginRequest);
  expect(onSendLoginMock).lastCalledWith(goodLoginRequest);
  expect(onSendAnyMock).lastCalledWith(
    ClientPacketType.LOG_IN,
    goodLoginRequest
  );

  // Receive successful login packet.
  const goodLoginResponse = {};
  await expect(
    connection.onReceiveOnce(ServerPacketType.LOG_IN_OK)
  ).resolves.toStrictEqual(goodLoginResponse);
  expect(onReceiveLoginSuccessMock).lastCalledWith(goodLoginResponse);
  expect(onReceiveAnyMock).lastCalledWith(
    ServerPacketType.LOG_IN_OK,
    goodLoginResponse
  );

  // Send ping packet.
  const pingRequest = { echo: Buffer.from([0x01, 0x02, 0x03, 0x04]) };
  await expect(
    connection.send(ClientPacketType.PING, pingRequest)
  ).resolves.toStrictEqual(pingRequest);
  expect(onSendPingMock).lastCalledWith(pingRequest);
  expect(onSendAnyMock).lastCalledWith(ClientPacketType.PING, pingRequest);

  // Receive pong packet.
  const pongResponse = { echo: Buffer.from([0x01, 0x02, 0x03, 0x04]) };
  await expect(
    connection.onReceiveOnce(ServerPacketType.PONG)
  ).resolves.toStrictEqual(pongResponse);
  expect(onReceivePongMock).lastCalledWith(pongResponse);
  expect(onReceiveAnyMock).lastCalledWith(ServerPacketType.PONG, pongResponse);
});
