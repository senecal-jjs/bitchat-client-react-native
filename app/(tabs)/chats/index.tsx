import ConversationItem from "@/components/conversation";
import QRModal from "@/components/qr-modal";
import { BounceButton } from "@/components/ui/bounce-button";
import { IconSymbol } from "@/components/ui/icon-symbol";
import {
  GroupsRepositoryToken,
  MessagesRepositoryToken,
  useRepos,
} from "@/contexts/repository-context";
import { dbListener } from "@/repos/db-listener";
import GroupsRepository from "@/repos/specs/groups-repository";
import MessagesRepository from "@/repos/specs/messages-repository";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export type Conversation = {
  id: string;
  name: string;
  lastMessage: string;
  hasUnread: boolean;
  timestamp: string;
  rawTimestamp: number;
};

export default function TabTwoScreen() {
  const router = useRouter();
  const [showQRModal, setShowQRModal] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const { getRepo } = useRepos();
  const groupsRepo = getRepo<GroupsRepository>(GroupsRepositoryToken);
  const messagesRepo = getRepo<MessagesRepository>(MessagesRepositoryToken);

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

  const fetchConversations = useCallback(async () => {
    const groups = await groupsRepo.list();
    console.log("building conversations: ", Date.now());

    const conversationPromises = groups.map(async (group) => {
      // Get last message for this group
      const lastMessageData = await messagesRepo.getByGroupId(group.id, 1, 0);
      const hasUnread = await messagesRepo.hasUnreadInGroup(group.id);

      let lastMessage = "";
      let timestamp = "";
      let rawTimestamp = 0;

      if (lastMessageData.length > 0) {
        lastMessage = lastMessageData[0].message.contents;
        rawTimestamp = lastMessageData[0].message.timestamp;
        timestamp = formatTimestamp(rawTimestamp);
      } else {
        lastMessage = "You've been added to a group";
        rawTimestamp = group.createdAt;
        timestamp = formatTimestamp(rawTimestamp);
      }

      return {
        id: group.id,
        name: group.name,
        lastMessage,
        hasUnread,
        timestamp,
        rawTimestamp,
      };
    });

    const fetchedConversations = (await Promise.all(conversationPromises)).sort(
      (a, b) => b.rawTimestamp - a.rawTimestamp,
    );
    setConversations(fetchedConversations);
  }, [groupsRepo, messagesRepo]);

  // force refresh on focus, to make sure unread/read dot is shown appropriately
  useFocusEffect(() => {
    fetchConversations();
  });

  useEffect(() => {
    fetchConversations();

    // Listen for group creation events
    dbListener.onGroupCreation(fetchConversations);
    dbListener.onGroupUpdate(fetchConversations);
    dbListener.onMessageChange(fetchConversations);

    // Cleanup listener on unmount
    return () => {
      dbListener.removeGroupCreationListener(fetchConversations);
      dbListener.removeGroupUpdateListener(fetchConversations);
      dbListener.removeMessageChangeListener(fetchConversations);
    };
  }, [fetchConversations]);

  const handleOpenModal = () => {
    setShowQRModal(true);
  };

  const startNewMessage = () => {
    router.navigate({
      pathname: "/(group-modal)/start-group",
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
        {conversations.length > 0 && (
          <FlatList
            data={conversations}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
          />
        )}
        {conversations.length <= 0 && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No chats yet</Text>
            <Text style={styles.emptySubtext}>
              Tap the new message icon to start a chat
            </Text>
          </View>
        )}

        <View style={styles.floatingButtonContainer}>
          <BounceButton onPress={handleOpenModal}>
            <IconSymbol size={28} name="qrcode" color={"white"}></IconSymbol>
          </BounceButton>

          <BounceButton
            // style={styles.floatingButton}
            onPress={() => startNewMessage()}
          >
            <IconSymbol
              size={28}
              name="square.and.pencil"
              color={"white"}
            ></IconSymbol>
          </BounceButton>
        </View>

        <QRModal
          showQRModal={showQRModal}
          handleClose={() => setShowQRModal(false)}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#090909ff",
  },
  floatingButtonContainer: {
    position: "absolute",
    bottom: 20,
    right: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    minWidth: 120,
    gap: 12,
    backgroundColor: "#272727ff",
    padding: 13,
    borderRadius: 20,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.15)",
    borderLeftColor: "rgba(255, 255, 255, 0.15)",
    shadowColor: "rgba(255, 255, 255, 0.1)",
    shadowOffset: {
      width: -1,
      height: -1,
    },
    shadowOpacity: 1,
    shadowRadius: 2,
  },
  floatingButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#0B93F6",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
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
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 60,
    paddingHorizontal: 10,
  },
  emptyText: {
    fontSize: 18,
    color: "#666",
    fontWeight: "600",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#444",
  },
});
