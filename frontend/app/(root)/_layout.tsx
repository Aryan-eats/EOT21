import { Stack } from "expo-router";

const Layout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="restaurant"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="review-rating"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="coupons"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="payment"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="order-tracking"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
export default Layout;
