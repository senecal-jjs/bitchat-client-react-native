import { Message } from "@/types/global";
import React, { createContext, useContext, useState } from "react";

interface MessageContextType {
  messages: Message[];
  setMessages: (messages: Message[]) => void;
}

const MessageContext = createContext<MessageContextType | undefined>(undefined);

export const MessageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const value = { messages, setMessages };

  return (
    <MessageContext.Provider value={value}>{children}</MessageContext.Provider>
  );
};

export const useMessageProvider = () => {
  const context = useContext(MessageContext);

  if (context === undefined) {
    throw new Error("useMessageProvider must be used within a MessageProvider");
  }

  return context;
};
