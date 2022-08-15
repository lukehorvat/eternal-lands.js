# eternal-lands.js [![npm version](http://img.shields.io/npm/v/eternal-lands.js.svg?style=flat-square)](https://www.npmjs.org/package/eternal-lands.js) [![build status](https://img.shields.io/github/workflow/status/lukehorvat/eternal-lands.js/Build?style=flat-square)](https://github.com/lukehorvat/eternal-lands.js/actions/workflows/build.yml)

A JavaScript (and TypeScript) client library for [Eternal Lands](http://www.eternal-lands.com).

It provides several abstractions for managing the "low-level" (i.e. sending and receiving of packets) so that you can focus on building the "high-level" (e.g. trade bots, guard bots, AI-controlled ants, etc).

## Installation

Install the package via npm:

```sh
$ npm install eternal-lands.js
```

## Usage

A quick example:

```ts
import * as EL from 'eternal-lands.js';

const elc = new EL.Client();

// Connect to the server
await elc.connect();

// Log in
elc.send(EL.ClientPacketType.LOG_IN, { username, password });
await elc.onReceiveOnce(EL.ServerPacketType.LOG_IN_OK);

// Send a message to local chat
elc.send(EL.ClientPacketType.RAW_TEXT, { message: 'Hello, world!' });
```

See the [examples](/examples/) directory for more.

## API

The library exposes the following:

- [Client](#client)
- [TcpSocketClient](#tcpsocketclient)
- [WebSocketClient](#websocketclient)
- [ClientPacket](#clientpacket)
- [ClientPacketType](#clientpackettype)
- [ServerPacket](#serverpacket)
- [ServerPacketType](#serverpackettype)
- [Constants](#constants)

### Client

Simply a shorthand alias for [TcpSocketClient](#tcpsocketclient).

### TcpSocketClient

Class representing a client that connects to the EL server directly via a TCP socket.

This client only works in a Node.js environment, not in the browser.

#### constructor({ host, port })

Create a new `TcpSocketClient` instance.

By default it is configured to connect to the official EL test server, but this can be changed by specifying different `host` and `port` options.

Example:

```ts
const client = new EL.TcpSocketClient({ port: 2000 });
```

#### connect()

Connect to the server.

Returns a promise that is resolved once the client has connected.

Example:

```ts
await client.connect();
```

#### disconnect()

Disconnect from the server.

Returns a promise that is resolved once the client has disconnected.

Example:

```ts
await client.disconnect();
```

#### isConnected

A boolean representing the current connection status.

Example:

```ts
console.log(client.isConnected);
```

#### send(type, data)

Send a packet of a particular type to the server.

Returns a promise that is resolved once the packet has been sent.

Example:

```ts
client.send(EL.ClientPacketType.TRADE_WITH, { actorId: 230 });
```

#### onConnect(listener)

Listen to when the client connects to the server.

Returns a function that can be called to unsubscribe `listener`.

Example:

```ts
client.onConnect(() => console.log('Connected!'));
```

#### onDisconnect(listener)

Listen to when the client disconnects from the server.

Returns a function that can be called to unsubscribe `listener`.

Example:

```ts
client.onDisconnect(() => console.log('Disconnected!'));
```

#### onSend(type, listener)

Listen to when the client sends a packet of a particular type to the server.

Returns a function that can be called to unsubscribe `listener`.

Example:

```ts
client.onSend(EL.ClientPacketType.RAW_TEXT, (data) => {
  console.log('Sent RAW_TEXT packet', data.message);
});
```

#### onSendOnce(type)

Listen to when the client sends a packet of a particular type to the server, only _once_!

Returns a Promise that is resolved with the packet's data.

Example:

```ts
const { objectId } = await client.onSendOnce(
  EL.ClientPacketType.USE_MAP_OBJECT
);
```

#### onSendAny(listener)

Listen to when the client sends a packet of _any_ type to the server.

Returns a function that can be called to unsubscribe `listener`.

Example:

```ts
client.onSendAny((type, data) => {
  console.log('Sent packet', EL.ClientPacketType[type], data);
});
```

#### onReceive(type, listener)

Listen to when the client receives a packet of a particular type from the server.

Returns a function that can be called to unsubscribe `listener`.

```ts
client.onReceive(EL.ServerPacketType.NEW_MINUTE, (data) => {
  console.log('Received NEW_MINUTE packet', data.minute);
});
```

#### onReceiveOnce(type)

Listen to when the client receives a packet of a particular type from the server, only _once_!

Returns a Promise that is resolved with the packet's data.

```ts
const { actorId } = await client.onReceiveOnce(
  EL.ServerPacketType.REMOVE_ACTOR
);
```

#### onReceiveAny(listener)

Listen to when the client receives a packet of _any_ type from the server.

Returns a function that can be called to unsubscribe `listener`.

```ts
client.onReceiveAny((type, data) => {
  console.log('Received packet', EL.ServerPacketType[type], data);
});
```

### WebSocketClient

TODO

### ClientPacket

TODO

### ClientPacketType

TODO

### ServerPacket

TODO

### ServerPacketType

TODO

### Constants

TODO
