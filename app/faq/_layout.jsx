import { Stack } from "expo-router";

export default function FaqLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="detailFaq" options={{ headerShown: false }} />
    </Stack>
  );
}
