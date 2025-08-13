import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { redirectToDeliveryApp } from '../../services/linking';
import { useAuthStore } from '../../stores/auth.store';

export default function OnboardingSteps() {
  const router = useRouter();
  const { riderData } = useAuthStore();

  useEffect(() => {
    const completeOnboarding = async () => {
      try {
        if (riderData) {
          await redirectToDeliveryApp(riderData);
        } else {
          // Fallback if no rider data
          router.replace('/auth/sign-up');
        }
      } catch (error) {
        console.error('Onboarding error:', error);
        router.replace('/auth/sign-up');
      }
    };

    completeOnboarding();
  }, []);

  return (
    <View className="flex-1 justify-center items-center bg-white">
      <ActivityIndicator size="large" />
      <Text className="mt-4 text-lg">Redirecting to Delivery App...</Text>
    </View>
  );
}