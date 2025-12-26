import { Stack } from "expo-router";

export default function ModalLayout() {
  return (
    <Stack
      screenOptions={{
        presentation: "modal", // Key option to make it a modal
      }}
    >
      <Stack.Screen
        name="start-settings"
        options={{
          headerShown: false,
        }}
      ></Stack.Screen>
    </Stack>
  );
}
