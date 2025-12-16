import { Message } from "@/types/global";

/**
 * Holds messages awaiting broadcast, that originated on this device.
 */
export default interface OutgoingMessagesRepository {
  create(message: Message): Promise<Message>;
  delete(messageId: string): Promise<Message | null>;
  getAll(): Promise<Message[]>;
  exists(messageId: string): Promise<boolean>;
}
