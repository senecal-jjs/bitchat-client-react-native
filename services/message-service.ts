import { BitchatPacket } from "@/types/global";
import { Buffer } from "buffer";
import { decode } from "./packet-service";
import { fromBinaryPayload } from "./protocol-service";

function MessageService() {
    const receivePacket = (packet: string) => {
        const packetBytes = Buffer.from(packet, "base64")
        const decodePacket: BitchatPacket = decode(packetBytes)
        console.log(decodePacket)
        const message = fromBinaryPayload(decodePacket!.payload)
        console.log(message)
    }

    return {
        receivePacket
    };
}


export default MessageService