# eternal-lands.js [![npm version](http://img.shields.io/npm/v/eternal-lands.js.svg?style=flat-square)](https://www.npmjs.org/package/eternal-lands.js) [![build status](https://img.shields.io/github/workflow/status/lukehorvat/eternal-lands.js/Build?style=flat-square)](https://github.com/lukehorvat/eternal-lands.js/actions/workflows/build.yml)

A JavaScript (and TypeScript) client library for [Eternal Lands](http://www.eternal-lands.com).

It provides several abstractions for managing the "low-level" (i.e. sending and receiving of packets) so that you can focus on building the "high-level" (e.g. trade bots, guard bots, AI-controlled ants, etc).

Works both in Node.js _and_ in web browsers! 🎉 (However, for browsers please read the [Browser support](#browser-support) section.)

## Installation

Install the package via npm:

```sh
$ npm install eternal-lands.js
```

## Usage

A quick example:

```ts
import * as EL from 'eternal-lands.js';

const client = new EL.Client();

// Connect to the server
await client.connect();

// Log in
client.send(EL.ClientPacketType.LOG_IN, { username, password });
await client.onReceiveOnce(EL.ServerPacketType.LOG_IN_OK);

// Send a message to local chat
client.send(EL.ClientPacketType.RAW_TEXT, { message: 'Hello, world!' });
```

See the [examples](examples/) directory for more.

## API

The library exposes the following API:

- [Client](#client)
- [TcpSocketClient](#tcpsocketclient)
- [WebSocketClient](#websocketclient)
- [ClientPacketType](#clientpackettype)
- [ServerPacketType](#serverpackettype)
- [ClientPacket](#clientpacket)
- [ServerPacket](#serverpacket)
- [Constants](#constants)

Although JavaScript is supported, it's highly recommended to consume this library's API via TypeScript. In editors like VSCode you will get tab completion and suggestions which make the API _much_ easier to work with.

### Client

Simply a shorthand alias for [TcpSocketClient](#tcpsocketclient).

### TcpSocketClient

Class representing a client that connects to the EL server directly via a TCP socket.

This client only works in Node.js, not in web browsers.

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

Example:

```ts
client.onReceive(EL.ServerPacketType.NEW_MINUTE, (data) => {
  console.log('Received NEW_MINUTE packet', data.minute);
});
```

#### onReceiveOnce(type)

Listen to when the client receives a packet of a particular type from the server, only _once_!

Returns a Promise that is resolved with the packet's data.

Example:

```ts
const { actorId } = await client.onReceiveOnce(
  EL.ServerPacketType.REMOVE_ACTOR
);
```

#### onReceiveAny(listener)

Listen to when the client receives a packet of _any_ type from the server.

Returns a function that can be called to unsubscribe `listener`.

Example:

```ts
client.onReceiveAny((type, data) => {
  console.log('Received packet', EL.ServerPacketType[type], data);
});
```

### WebSocketClient

Class representing a client that connects to the EL server via a WebSocket.

This client works both in Node.js _and_ in web browsers.

It has the exact same methods and properties as a [TcpSocketClient](#tcpsocketclient), so I won't bother listing them all again here. The only difference is the options passed to the constructor, detailed below.

#### constructor({ url })

Create a new `WebSocketClient` instance.

Since there is no "official" WebSocket server hosted for EL at this point in time, there is no server it can connect to by default. Therefore the server URL **must** be specified via the constructor options.

Example:

```ts
const client = new EL.WebSocketClient({ url: 'ws://localhost:8000' });
```

### ClientPacketType

Enum representing the packet types that can be sent from client to server. The types are lifted directly from the official EL client [source](https://github.com/raduprv/Eternal-Lands/blob/master/client_serv.h).

Please refer to [lib/packets/client/index.ts](lib/packets/client/index.ts) to understand which types are currently supported by this library. If you need to indicate a packet type that the library currently does not support, use the special `UNSUPPORTED` type.

Example:

```ts
console.log(EL.ClientPacketType.HEART_BEAT); // = 14
console.log(EL.ClientPacketType.DO_EMOTE); // = 70
console.log(EL.ClientPacketType.UNSUPPORTED); // = -1
```

### ServerPacketType

Enum representing the packet types that can be sent from server to client. The types are lifted directly from the official EL client [source](https://github.com/raduprv/Eternal-Lands/blob/master/client_serv.h).

Please refer to [lib/packets/server/index.ts](lib/packets/server/index.ts) to understand which types are currently supported by this library. If you need to indicate a packet type that the library currently does not support, use the special `UNSUPPORTED` type.

Example:

```ts
console.log(EL.ServerPacketType.CHANGE_MAP); // = 7
console.log(EL.ServerPacketType.ADD_NEW_ENHANCED_ACTOR); // = 51
console.log(EL.ServerPacketType.UNSUPPORTED); // = -1
```

### ClientPacket

Class representing a packet that can be sent from client to server.

Typically you wouldn't ever need to use this class directly, since the client classes eliminate any real need for it. However, in cases where you may not be using the client classes, it can be useful (e.g. see [examples/sniff-client-packets.ts](examples/sniff-client-packets.ts)).

#### constructor(type, data)

Create a new `ClientPacket` instance.

Example:

```ts
const packet = new EL.ClientPacket(EL.ClientPacketType.INSPECT_BAG, {
  bagId: 3,
});
```

#### toBuffer()

Convert the client packet to a buffer.

Returns the buffer.

Example:

```ts
const buffer = packet.toBuffer();
```

#### fromBuffer(buffer) [static method]

Read client packets from a buffer.

Returns the packets parsed from the buffer, as well as any remaining buffer that wasn't large enough to contain a packet.

Example:

```ts
const { packets, remainingBuffer } = EL.ClientPacket.fromBuffer(buffer);
```

#### isType(packet, type) [static method]

Check whether a client packet is of a particular type.

Returns a boolean that is `true` if the type matches.

Example:

```ts
const isHarvest = ClientPacket.isType(packet, ClientPacketType.HARVEST);
```

### ServerPacket

Class representing a packet that can be sent from server to client.

Typically you wouldn't ever need to use this class directly, since the client classes eliminate any real need for it. However, in cases where you may not be using the client classes, it can be useful (e.g. see [examples/sniff-server-packets.ts](examples/sniff-server-packets.ts)).

It has the exact same methods and properties as [ClientPacket](#clientpacket), so I won't bother listing them all again here. The only difference is it deals with [ServerPacketType](#serverpackettype), not [ClientPacketType](#clientpackettype).

Example:

```ts
const packet = new EL.ServerPacket(EL.ServerPacketType.INVENTORY_ITEM_TEXT, {
  text: `You are hungry, you can't manufacture anything.`,
});
```

### Constants

Various enums and constants that may be useful.

I won't bother listing them all here; just refer to [lib/constants.ts](lib/constants.ts).

Example:

```ts
const client = new EL.Client({ port: EL.Constants.ServerPort.MAIN_SERVER });

client.onReceive(EL.ServerPacketType.RAW_TEXT, (data) => {
  if (
    data.channel === EL.Constants.ChatChannel.SERVER &&
    data.message.includes('wants to trade with you.')
  ) {
    // Someone initiated a trade.
  }
});
```

## Browser support

TODO
