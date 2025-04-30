import { Stack } from "expo-router";

export default function ProfileLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="profileMain"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="deleteAccount"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
