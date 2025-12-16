import { useEventListener } from "expo";
import { Tabs } from "expo-router";
import React from "react";

import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { usePacketService } from "@/hooks/use-packet-service";
import BleModule from "@/modules/ble/src/BleModule";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { handleIncomingPacket } = usePacketService();

  useEventListener(BleModule, "onPeripheralReceivedWrite", (message) => {
    // on packet receive, try to assemble into completed message and push to messages repo
    console.log("onPeripheralReceivedWrite");
    handleIncomingPacket(message.rawBytes);
  });

  useEventListener(BleModule, "onCentralReceivedNotification", (message) => {
    // store in packets repo
    console.log("onCentralReceivedNotification");
    handleIncomingPacket(message.rawBytes);
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
