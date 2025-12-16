import { Message } from "./global";

interface MessageService {
  sendMessage(message: Message): void;
  handlePacket(packet: Uint8Array): void;
}

export { MessageService };
