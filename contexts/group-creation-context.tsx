import { Contact } from "@/repos/specs/contacts-repository";
import React, { createContext, ReactNode, useContext, useState } from "react";

interface GroupCreationContextType {
  selectedMembers: Contact[];
  setSelectedMembers: (members: Contact[]) => void;
  groupName: string;
  setGroupName: (name: string) => void;
  reset: () => void;
}

const GroupCreationContext = createContext<
  GroupCreationContextType | undefined
>(undefined);

export function GroupCreationProvider({ children }: { children: ReactNode }) {
  const [selectedMembers, setSelectedMembers] = useState<Contact[]>([]);
  const [groupName, setGroupName] = useState("");

  const reset = () => {
    setSelectedMembers([]);
    setGroupName("");
  };

  return (
    <GroupCreationContext.Provider
      value={{
        selectedMembers,
        setSelectedMembers,
        groupName,
        setGroupName,
        reset,
      }}
    >
      {children}
    </GroupCreationContext.Provider>
  );
}

export function useGroupCreation() {
  const context = useContext(GroupCreationContext);
  if (context === undefined) {
    throw new Error(
      "useGroupCreation must be used within a GroupCreationProvider",
    );
  }
  return context;
}
