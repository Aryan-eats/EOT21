import "./global.css";
import { Stack } from 'expo-router';
import { useEffect, useState, useCallback } from 'react';
import { View, StatusBar } from 'react-native';
import * as Font from 'expo-font';
import * as SplashScreen from "expo-splash-screen";

export default function RootLayout() {
  const [appIsReady, setAppIsReady] = useState(false);

  const loadAssetsAsync = useCallback(async () => {
    try {
      await Font.loadAsync({
        "Jakarta-Bold": require("../assets/fonts/PlusJakartaSans-Bold.ttf"),
        "Jakarta-ExtraBold": require("../assets/fonts/PlusJakartaSans-ExtraBold.ttf"),
        "Jakarta-ExtraLight": require("../assets/fonts/PlusJakartaSans-ExtraLight.ttf"),
        "Jakarta-Light": require("../assets/fonts/PlusJakartaSans-Light.ttf"),
        "Jakarta-Medium": require("../assets/fonts/PlusJakartaSans-Medium.ttf"),
        Jakarta: require("../assets/fonts/PlusJakartaSans-Regular.ttf"),
        "Jakarta-SemiBold": require("../assets/fonts/PlusJakartaSans-SemiBold.ttf"),
      });
    } catch (e) {
      console.warn("Font loading failed", e);
    } finally {
      setAppIsReady(true);
    }
  }, []);

  useEffect(() => {
    loadAssetsAsync();
  }, []);

  useEffect(() => {
    if (appIsReady) {
      SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return <View style={{ flex: 1, backgroundColor: '#000' }} />;
  }

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="Sections" />
      </Stack>
    </>
  );
} 