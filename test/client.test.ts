import { Client } from '../lib/client';
import { ClientPacketType } from '../lib/packets/client';
import { ServerPacketType } from '../lib/packets/server';
import { MockELServer } from './util/mock-server';

let server: MockELServer;
let client: Client;

beforeEach(() => {
  server = new MockELServer({ port: 8000 });
  client = new Client({ host: 'localhost', port: 8000 });
});

afterEach(async () => {
  if (client.isConnected) {
    await client.disconnect();
  }

  await server.stop();
});

test('Can connect, disconnect, and reconnect', async () => {
  await server.start();

  const onConnectMock = jest.fn();
  const onDisconnectMock = jest.fn();
  client.onConnect(onConnectMock);
  client.onDisconnect(onDisconnectMock);

  // Connect
  expect(onConnectMock).toBeCalledTimes(0);
  expect(client.isConnected).toBe(false);
  await client.connect();
  expect(onConnectMock).toBeCalledTimes(1);
  expect(client.isConnected).toBe(true);

  // Disconnect
  expect(onDisconnectMock).toBeCalledTimes(0);
  await client.disconnect();
  expect(onDisconnectMock).toBeCalledTimes(1);
  expect(client.isConnected).toBe(false);

  // Connect again
  await client.connect();
  expect(onConnectMock).toBeCalledTimes(2);
  expect(client.isConnected).toBe(true);

  // Disconnect again
  await client.disconnect();
  expect(onDisconnectMock).toBeCalledTimes(2);
  expect(client.isConnected).toBe(false);
});

test(`Throws an error when it can't connect`, async () => {
  // Try to connect even though the server isn't started
  await expect(client.connect()).rejects.toThrow();

  await server.start();

  // Just to check if it can recover, try to connect again now that the server is started
  await client.connect();
});

test(`Throws an error when attempting to connect whilst already connected`, async () => {
  await server.start();

  await client.connect();
  await expect(client.connect()).rejects.toThrow('Already connected!');
});

test(`Throws an error when attempting to connect whilst already in the process of connecting`, async () => {
  await server.start();

  // Start connecting (note the lack of await)
  const promise = client.connect();

  // Now try to connect again while the previous promise is unresolved
  await expect(client.connect()).rejects.toThrow(
    'Already in the process of connecting!'
  );

  await promise;
});

test(`Throws an error when attempting to disconnect whilst already disconnected`, async () => {
  await expect(client.disconnect()).rejects.toThrow('Already disconnected!');

  await server.start();
  await client.connect();

  await client.disconnect();
  await expect(client.disconnect()).rejects.toThrow('Already disconnected!');
});

test(`Throws an error when attempting to disconnect whilst in the process of connecting`, async () => {
  await server.start();

  // Start connecting (note the lack of await)
  const promise = client.connect();

  await expect(client.disconnect()).rejects.toThrow(
    'Cannot disconnect whilst in the process of connecting!'
  );

  await promise;
});

test(`Throws an error when attempting to connect whilst in the process of disconnecting`, async () => {
  await server.start();
  await client.connect();

  // Start disconnecting (note the lack of await)
  const promise = client.disconnect();

  await expect(client.connect()).rejects.toThrow(
    'Cannot connect whilst in the process of disconnecting!'
  );

  await promise;
});

test(`Throws an error when attempting to send packets whilst disconnected`, async () => {
  await expect(
    client.send(ClientPacketType.RAW_TEXT, {
      message: 'test',
    })
  ).rejects.toThrow('Cannot send when disconnected!');
});

test('Can send and receive packets whilst connected', async () => {
  await server.start();
  await client.connect();

  // Setup listeners
  const onSendLoginMock = jest.fn();
  const onSendPingMock = jest.fn();
  const onSendAnyMock = jest.fn();
  const onReceiveLoginFailMock = jest.fn();
  const onReceiveLoginSuccessMock = jest.fn();
  const onReceivePongMock = jest.fn();
  const onReceiveAnyMock = jest.fn();
  client.onSend(ClientPacketType.LOG_IN, onSendLoginMock);
  client.onSend(ClientPacketType.PING, onSendPingMock);
  client.onSendAny(onSendAnyMock);
  client.onReceive(ServerPacketType.LOG_IN_NOT_OK, onReceiveLoginFailMock);
  client.onReceive(ServerPacketType.LOG_IN_OK, onReceiveLoginSuccessMock);
  client.onReceive(ServerPacketType.PONG, onReceivePongMock);
  client.onReceiveAny(onReceiveAnyMock);

  // Send login packet with incorrect credentials.
  const badLoginRequest = { username: 'Test', password: 'bad_password' };
  client.send(ClientPacketType.LOG_IN, badLoginRequest);
  await expect(
    client.onSendOnce(ClientPacketType.LOG_IN)
  ).resolves.toStrictEqual(badLoginRequest);
  expect(onSendLoginMock).lastCalledWith(badLoginRequest);
  expect(onSendAnyMock).lastCalledWith(
    ClientPacketType.LOG_IN,
    badLoginRequest
  );

  // Receive failed login packet.
  const badLoginResponse = { reason: 'Wrong password.' };
  await expect(
    client.onReceiveOnce(ServerPacketType.LOG_IN_NOT_OK)
  ).resolves.toStrictEqual(badLoginResponse);
  expect(onReceiveLoginFailMock).lastCalledWith(badLoginResponse);
  expect(onReceiveAnyMock).lastCalledWith(
    ServerPacketType.LOG_IN_NOT_OK,
    badLoginResponse
  );

  // Send login packet with correct credentials.
  const goodLoginRequest = { username: 'Test', password: 'good_password' };
  client.send(ClientPacketType.LOG_IN, goodLoginRequest);
  await expect(
    client.onSendOnce(ClientPacketType.LOG_IN)
  ).resolves.toStrictEqual(goodLoginRequest);
  expect(onSendLoginMock).lastCalledWith(goodLoginRequest);
  expect(onSendAnyMock).lastCalledWith(
    ClientPacketType.LOG_IN,
    goodLoginRequest
  );

  // Receive successful login packet.
  const goodLoginResponse = {};
  await expect(
    client.onReceiveOnce(ServerPacketType.LOG_IN_OK)
  ).resolves.toStrictEqual(goodLoginResponse);
  expect(onReceiveLoginSuccessMock).lastCalledWith(goodLoginResponse);
  expect(onReceiveAnyMock).lastCalledWith(
    ServerPacketType.LOG_IN_OK,
    goodLoginResponse
  );

  // Send ping packet.
  const pingRequest = { echo: Buffer.from([0x01, 0x02, 0x03, 0x04]) };
  await expect(
    client.send(ClientPacketType.PING, pingRequest)
  ).resolves.toStrictEqual(pingRequest);
  expect(onSendPingMock).lastCalledWith(pingRequest);
  expect(onSendAnyMock).lastCalledWith(ClientPacketType.PING, pingRequest);

  // Receive pong packet.
  const pongResponse = { echo: Buffer.from([0x01, 0x02, 0x03, 0x04]) };
  await expect(
    client.onReceiveOnce(ServerPacketType.PONG)
  ).resolves.toStrictEqual(pongResponse);
  expect(onReceivePongMock).lastCalledWith(pongResponse);
  expect(onReceiveAnyMock).lastCalledWith(ServerPacketType.PONG, pongResponse);
});
