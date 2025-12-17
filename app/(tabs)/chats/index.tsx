import ContactList from "@/components/contact-list";
import ConversationItem from "@/components/conversation";
import QRModal from "@/components/qr-modal";
import { IconSymbol } from "@/components/ui/icon-symbol";
import {
  GroupsRepositoryToken,
  MessagesRepositoryToken,
  useRepos,
} from "@/contexts/repository-context";
import { dbListener } from "@/repos/db-listener";
import { Contact } from "@/repos/specs/contacts-repository";
import GroupsRepository from "@/repos/specs/groups-repository";
import MessagesRepository from "@/repos/specs/messages-repository";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

const mockConversations = [
  {
    id: "1",
    name: "Alice",
    lastMessage: "Hey, how are you?",
    timestamp: "10:30 AM",
  },
  { id: "2", name: "Bob", lastMessage: "Sounds good!", timestamp: "Yesterday" },
  {
    id: "3",
    name: "Charlie",
    lastMessage: "See you there.",
    timestamp: "Tuesday",
  },
];

type Conversation = {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: string;
};

export default function TabTwoScreen() {
  const router = useRouter();
  const [showQRModal, setShowQRModal] = useState(false);
  const [showContactList, setShowContactList] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const { getRepo } = useRepos();
  const groupsRepo = getRepo<GroupsRepository>(GroupsRepositoryToken);
  const messagesRepo = getRepo<MessagesRepository>(MessagesRepositoryToken);

  const fetchConversations = async () => {
    const groups = await groupsRepo.list();

    const conversationPromises = groups.map(async (group) => {
      console.log("building conversations");
      // Get last message for this group
      const lastMessageData = await messagesRepo.getByGroupId(group.id, 1, 0);

      let lastMessage = "";
      let timestamp = "";

      if (lastMessageData.length > 0) {
        lastMessage = lastMessageData[0].contents;
        timestamp = formatTimestamp(lastMessageData[0].timestamp);
      } else {
        lastMessage = "No messages yet";
        timestamp = formatTimestamp(group.createdAt);
      }

      return {
        id: group.id,
        name: group.name,
        lastMessage,
        timestamp,
      };
    });

    const fetchedConversations = await Promise.all(conversationPromises);
    setConversations(fetchedConversations);
  };

  useEffect(() => {
    fetchConversations();

    // Listen for group creation events
    dbListener.onGroupCreation(fetchConversations);
    dbListener.onMessageChange(fetchConversations);
    dbListener.onGroupUpdate(fetchConversations);

    // Cleanup listener on unmount
    return () => {
      dbListener.removeGroupCreationListener(fetchConversations);
    };
  }, []);

  const formatTimestamp = (timestamp: number): string => {
    const now = Date.now();
    const diff = now - timestamp;
    const millisDay = 86_400_000;

    if (diff < millisDay) {
      // Less than a day
      const date = new Date(timestamp);
      return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    } else if (diff < millisDay * 7) {
      // Less than a week
      const date = new Date(timestamp);
      return date.toLocaleDateString("en-US", { weekday: "long" });
    } else {
      const date = new Date(timestamp);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }
  };

  const handleOpenModal = () => {
    setShowQRModal(true);
  };

  const handleContactPress = (contact: Contact) => {
    console.log("Contact selected:", contact.pseudonym);
    setShowContactList(false);
    // TODO: Navigate to chat with contact or create new conversation
    router.navigate({
      pathname: "/chats/[chatId]",
      params: { chatId: contact.id },
    });
  };

  const startNewMessage = () => {
    router.navigate({
      pathname: "/chats/start-message",
    });
  };

  const renderItem = ({ item }: { item: Conversation }) => (
    <ConversationItem
      conversation={item}
      onPress={() =>
        router.navigate({
          pathname: "/chats/[chatId]",
          params: { chatId: item.id },
        })
      }
    />
  );

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.mainContainer}>
        <View style={styles.chatHeader}>
          <Pressable onPress={handleOpenModal}>
            <IconSymbol size={28} name="qrcode" color={"white"}></IconSymbol>
          </Pressable>
          <Text style={styles.headerText}>Chats</Text>
          <Pressable onPress={() => startNewMessage()}>
            <IconSymbol
              size={28}
              name="square.and.pencil"
              color={"white"}
            ></IconSymbol>
          </Pressable>
        </View>
        <FlatList
          data={conversations}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
        />

        <QRModal
          showQRModal={showQRModal}
          handleClose={() => setShowQRModal(false)}
        />

        <Modal
          visible={showContactList}
          transparent
          animationType="fade"
          onRequestClose={() => setShowContactList(false)}
        >
          <SafeAreaProvider>
            <SafeAreaView style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>New Message</Text>
                <Pressable onPress={() => setShowContactList(false)}>
                  <IconSymbol size={32} name="x.circle" color={"white"} />
                </Pressable>
              </View>
              <ContactList onContactPress={handleContactPress} />
            </SafeAreaView>
          </SafeAreaProvider>
        </Modal>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#090909ff",
  },
  chatHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    padding: 15,
    backgroundColor: "rgba(38, 35, 35, 0.2)",
  },
  headerText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  modalContent: {
    flex: 1,
    backgroundColor: "#090909ff",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    backgroundColor: "rgba(38, 35, 35, 0.2)",
  },
  modalTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
});
