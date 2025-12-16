import { dbListener } from "@/repos/db-listener";
import MessagesRepository from "@/repos/specs/messages-repository";
import { Message } from "@/types/global";
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { MessagesRepositoryToken, useRepos } from "./repository-context";

interface MessageContextType {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  groupId: string | null;
}

const MessageContext = createContext<MessageContextType | undefined>(undefined);

export const MessageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { getRepo } = useRepos();
  const messagesRepo = useMemo(
    () => getRepo<MessagesRepository>(MessagesRepositoryToken),
    [getRepo],
  );
  const [messages, setMessages] = useState<Message[]>([]);
  const value = { messages, setMessages, groupId: null };

  useEffect(() => {
    const fetchMessages = async (limit: number) => {
      console.log("fetching messages from db");
      const latestMessages = await messagesRepo.getAll(limit);
      setMessages(latestMessages);
    };

    // Initial fetch
    fetchMessages(50);

    // Listen for database changes
    const handleMessageChange = () => {
      fetchMessages(50);
    };

    dbListener.onMessageChange(handleMessageChange);

    // Cleanup listener on unmount
    return () => {
      dbListener.removeMessageChangeListener(handleMessageChange);
    };
  }, [messagesRepo]);

  return (
    <MessageContext.Provider value={value}>{children}</MessageContext.Provider>
  );
};

export const useMessageProvider = (groupId?: string) => {
  const context = useContext(MessageContext);

  if (context === undefined) {
    throw new Error("useMessageProvider must be used within a MessageProvider");
  }

  // If groupId provided, filter messages for that group
  if (groupId) {
    return {
      ...context,
      messages: context.messages.filter((msg) => msg.groupId === groupId),
      groupId,
    };
  }

  return context;
};
