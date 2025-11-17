import { Message } from "@/types/global";
import { UUID } from "@/types/utility";

interface MessageRepository {
  create(message: Message): Message;
  get(id: UUID): Message;
}
