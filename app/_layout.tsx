import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { CredentialProvider } from "@/contexts/credential-context";
import { GroupCreationProvider } from "@/contexts/group-creation-context";
import { MessageProvider } from "@/contexts/message-context";
import { RepositoryProvider } from "@/contexts/repository-context";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { migrateDb } from "@/repos/db";
import { Buffer } from "buffer";
import * as SQLite from "expo-sqlite";
import { SQLiteProvider } from "expo-sqlite";
import "react-native-get-random-values";

global.Buffer = Buffer;

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  SQLite.deleteDatabaseAsync("bitchat.db");
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <SQLiteProvider databaseName="bitchat.db" onInit={migrateDb}>
        <RepositoryProvider>
          <MessageProvider>
            <CredentialProvider>
              <GroupCreationProvider>
                <Stack>
                  <Stack.Screen
                    name="(tabs)"
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="modal"
                    options={{ presentation: "modal", title: "Modal" }}
                  />
                  <Stack.Screen
                    name="select-group"
                    options={{
                      headerShown: false,
                      presentation: "card",
                    }}
                  />
                  <Stack.Screen
                    name="name-group"
                    options={{
                      headerShown: false,
                      presentation: "card",
                    }}
                  />
                </Stack>
                <StatusBar style="auto" />
              </GroupCreationProvider>
            </CredentialProvider>
          </MessageProvider>
        </RepositoryProvider>
      </SQLiteProvider>
    </ThemeProvider>
  );
}
