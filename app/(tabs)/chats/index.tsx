import ConversationItem from "@/components/conversation";
import { CredentialsQR } from "@/components/credentials-qr";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Credentials, SerializedCredentials } from "@/treekem/types";
import { Conversation } from "@/types/global";
import { secureFetch } from "@/utils/secure-store";
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

const CREDENTIALS_KEY = "treekem_credentials";

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

export default function TabTwoScreen() {
  const router = useRouter();
  const [showQRModal, setShowQRModal] = useState(false);
  const [credentials, setCredentials] = useState<Credentials | null>(null);

  useEffect(() => {
    const loadCredentials = async () => {
      try {
        const storedCreds = await secureFetch(CREDENTIALS_KEY);
        const serialized: SerializedCredentials = JSON.parse(storedCreds);

        const creds: Credentials = {
          verificationKey: Buffer.from(serialized.verificationKey, "base64"),
          pseudonym: serialized.pseudonym,
          signature: Buffer.from(serialized.signature, "base64"),
          rsaPublicKey: serialized.rsaPublicKey,
        };

        setCredentials(creds);
      } catch (error) {
        console.error("Failed to load credentials:", error);
      }
    };

    loadCredentials();
  }, []);

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
          <Pressable onPress={() => setShowQRModal(true)}>
            <IconSymbol size={28} name="qrcode" color={"white"}></IconSymbol>
          </Pressable>
          <Text style={styles.headerText}>Chats</Text>
          <IconSymbol
            size={28}
            name="square.and.pencil"
            color={"white"}
          ></IconSymbol>
        </View>
        <FlatList
          data={mockConversations}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
        />

        <Modal
          visible={showQRModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowQRModal(false)}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContent}>
            {credentials && (
              <CredentialsQR
                credentials={credentials}
                title="Scan to Add Me"
                size={200}
                handleClose={() => setShowQRModal(false)}
              />
            )}
            <Text style={styles.qrText}>
              Only share the QR code and link with people you trust. When
              shared, others will be able to see your username and start a chat
              with you.
            </Text>
          </View>
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
  },
  headerText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.95)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    flex: 1,
    width: "100%",
    backgroundColor: "#090909ff",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  qrText: {
    color: "white",
    textAlign: "center",
    paddingTop: 20,
  },
  closeButton: {
    marginTop: 20,
    paddingHorizontal: 30,
    paddingVertical: 12,
    backgroundColor: "#333",
    borderRadius: 8,
  },
  closeButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
