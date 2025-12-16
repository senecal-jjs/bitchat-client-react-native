import {
  MessagesRepositoryToken,
  OutgoingMessagesRepositoryToken,
  useRepos,
} from "@/contexts/repository-context";
import MessagesRepository from "@/repos/specs/messages-repository";
import OutgoingMessagesRepository from "@/repos/specs/outgoing-messages-repository";
import { Message } from "@/types/global";
import { MessageService } from "@/types/interface";

export function useMessageSender(): MessageService {
  const { getRepo } = useRepos();
  const outgoingMessagesRepo = getRepo<OutgoingMessagesRepository>(
    OutgoingMessagesRepositoryToken,
  );
  const messagesRepo = getRepo<MessagesRepository>(MessagesRepositoryToken);

  const sendMessage = (message: Message) => {
    outgoingMessagesRepo.create(message);
    messagesRepo.create(message);
  };

  return { sendMessage };
}
