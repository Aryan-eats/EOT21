import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="sign-up" />
      <Stack.Screen name="personal-details" />
      <Stack.Screen name="document-verification" />
      <Stack.Screen name="bank-details" />
    </Stack>
  );
}
