/**
 * In this example, we trigger a notification whenever the player's health
 * goes below a defined threshold value.
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

const LOW_HEALTH_THRESHOLD = 100;

function onPacketReceived(packet: EL.ServerPacket<EL.ServerPacketType>) {
  if (
    EL.ServerPacket.isType(packet, EL.ServerPacketType.SEND_PARTIAL_STAT) &&
    packet.data.statType === EL.Constants.StatType.MATERIAL_POINTS_CURRENT &&
    packet.data.statValue < LOW_HEALTH_THRESHOLD
  ) {
    notifier.notify({
      title: 'Heal yourself!',
      message: `Health is below ${LOW_HEALTH_THRESHOLD}.`,
      sound: 'Glass',
      timeout: 4,
    });
  }
}
