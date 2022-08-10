/**
 * In this example, we sniff packets received from the EL server.
 *
 * Obviously, you need to install `pcap` first before running this example.
 */

import { ELConstants, ELServerPacket, ELServerPacketType } from '../lib';
import pcap from 'pcap';

console.log('Sniffing packets received from server...');

pcap
  .createSession('en0', {
    filter: `tcp src port ${ELConstants.ServerPort.MAIN_SERVER} and host ${ELConstants.SERVER_HOST}`,
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
  const { packets, remainingBuffer } = ELServerPacket.fromBuffer(
    // Prepend any partial (overflow/underflow) packet data received previously.
    Buffer.concat([previousBuffer, buffer])
  );
  packets.forEach(onPacketReceived);
  previousBuffer = remainingBuffer;
}

function onPacketReceived(packet: ELServerPacket<ELServerPacketType>) {
  console.log(ELServerPacketType[packet.type], packet.data);
}
