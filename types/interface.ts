import { Message } from "./global";

interface MessageService {
  sendMessage(message: Message, from: string, to: string): void;
  handlePacket(packet: Uint8Array): void;
}

export { MessageService };
