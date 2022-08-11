/**
 * In this example, we sniff packets received from the EL server.
 *
 * Obviously, you need to install `pcap` first before running this example.
 */

import * as EL from '../lib';
import pcap from 'pcap';

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
  console.log(EL.ServerPacketType[packet.type], packet.data);
}
