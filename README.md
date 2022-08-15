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
