import { Message } from "@/types/global";
import { UUID } from "@/types/utility";

/**
 * Holds complete, decrypted messages, where the intended final recipient was this device.
 * Also holds messages that originated from this device.
 * Group conversations are constructed from this repository.
 */
export default interface MessagesRepository {
  create(message: Message): Promise<Message>;
  get(id: UUID): Promise<Message>;
  getAll(limit: number): Promise<Message[]>;
  getByGroupId(
    groupId: string,
    limit: number,
    offset?: number,
  ): Promise<Message[]>;
  exists(id: UUID): Promise<boolean>;
}
