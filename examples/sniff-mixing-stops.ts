/**
 * In this example, we trigger a notification whenever mixing is stopped by
 * sniffing packets received from the EL server.
 *
 * You need to install `pcap` and `node-notifier` first to run this example.
 */

import * as EL from 'eternal-lands.js';
import pcap from 'pcap';
import notifier from 'node-notifier';

console.log('Sniffing packets received from server...');

pcap
  .createSession('en0', {
    filter: `tcp src port ${EL.Constants.ServerPort.MAIN_SERVER} and host ${EL.Constants.SERVER_HOST}`,
  })
  .on('packet', (packet) => {
    const tcpPacket = pcap.decode.packet(packet).payload.payload.payload;

    // Filter out data-less TCP packets (ACK, etc.)
    if (!tcpPacket.data) {
      return;
    }

    onDataSniffed(tcpPacket.data);
  });

let previousBuffer = Buffer.alloc(0);

function onDataSniffed(buffer: Buffer) {
  const { packets, remainingBuffer } = EL.ServerPacket.fromBuffer(
    // Prepend any partial (overflow/underflow) packet data received previously.
    Buffer.concat([previousBuffer, buffer])
  );
  packets.forEach(onPacketReceived);
  previousBuffer = remainingBuffer;
}

function onPacketReceived(packet: EL.ServerPacket<EL.ServerPacketType>) {
  if (EL.ServerPacket.isType(packet, EL.ServerPacketType.INVENTORY_ITEM_TEXT)) {
    const { text } = packet.data;
    if (
      text.includes('You stopped working.') ||
      text.includes('You failed to create a[n]') ||
      text.includes(`You are hungry, you can't manufacture anything.`) ||
      text.includes('You need a Needle and you have none!')
    ) {
      notifier.notify({
        title: 'Mixing stopped!',
        message: `"${text}"`,
        sound: 'Ping',
        timeout: 2,
      });
    }
  }
}
