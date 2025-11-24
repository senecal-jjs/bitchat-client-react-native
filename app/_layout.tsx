import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { MessageProvider } from "@/contexts/message-context";
import { RepositoryProvider } from "@/contexts/repository-context";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { migrateDb } from "@/repos/db";
import * as SQLite from "expo-sqlite";
import { SQLiteProvider } from "expo-sqlite";

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
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen
                name="modal"
                options={{ presentation: "modal", title: "Modal" }}
              />
            </Stack>
            <StatusBar style="auto" />
          </MessageProvider>
        </RepositoryProvider>
      </SQLiteProvider>
    </ThemeProvider>
  );
}
