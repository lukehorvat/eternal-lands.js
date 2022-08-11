/**
 * In this example, we sniff packets sent by the EL client.
 *
 * Obviously, you need to install `pcap` first before running this example.
 */

import * as EL from '../lib';
import pcap from 'pcap';

console.log('Sniffing packets sent by client...');

pcap
  .createSession('en0', {
    filter: `tcp dst port ${EL.Constants.ServerPort.MAIN_SERVER} and host ${EL.Constants.SERVER_HOST}`,
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
  const { packets, remainingBuffer } = EL.ClientPacket.fromBuffer(
    // Prepend any partial (overflow/underflow) packet data received previously.
    Buffer.concat([previousBuffer, buffer])
  );
  packets.forEach(onPacketSent);
  previousBuffer = remainingBuffer;
}

function onPacketSent(packet: EL.ClientPacket<EL.ClientPacketType>) {
  console.log(EL.ClientPacketType[packet.type], packet.data);
}
