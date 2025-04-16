import { Stack } from "expo-router";

export default function NoticeLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="detailNotice" options={{ headerShown: false }} />
    </Stack>
  );
}
