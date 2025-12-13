import { Stack } from "expo-router";

export const unstable_settings = {
  initialRouteName: "index",
};

export default function ChatsLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
          title: "",
        }}
      />
      <Stack.Screen
        name="start-message"
        options={{
          headerShown: false,
          title: "",
          animation: "slide_from_bottom",
        }}
      />
    </Stack>
  );
}
