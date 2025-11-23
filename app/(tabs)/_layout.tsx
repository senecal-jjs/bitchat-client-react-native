import { useEventListener } from "expo";
import { Tabs } from "expo-router";
import React from "react";

import { HapticTab } from "@/components/haptic-tab";
import { useRepos } from "@/components/repository-context";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import BleModule from "@/modules/ble/src/BleModule";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { getRepo } = useRepos();
  const messagesRepo = getRepo("messagesRepo");

  useEventListener(BleModule, "onPeripheralReceivedWrite", (message) => {
    // store in packets repo, background job will process and store in messages repo when ready
    console.log("onPeripheralReceivedWrite");
  });

  useEventListener(BleModule, "onCentralReceivedNotification", (message) => {
    // store in packets repo
    console.log("onCentralReceivedNotification");
  });

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarButton: HapticTab,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Rooms",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="house.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="chats"
        options={{
          title: "Chats",
          tabBarLabel: "Chats",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="message" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
