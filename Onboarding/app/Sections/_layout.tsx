import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="work" />
      <Stack.Screen name="profile" />
      <Stack.Screen name="overview" />
      <Stack.Screen name="kit" />
      <Stack.Screen name="settings" />
    </Stack>
  );
}
