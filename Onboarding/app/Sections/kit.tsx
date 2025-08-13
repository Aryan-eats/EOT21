import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/stores/auth.store';

export default function KitSection() {
  const router = useRouter();
  const { setRiderData, riderData } = useAuthStore();
  const [loading, setLoading] = useState(false);

  const handleOrderKit = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setRiderData({ ...riderData, kitOrdered: true });
      setLoading(false);
      Alert.alert('Success', 'Your kit has been ordered!', [
        { text: 'OK', onPress: () => router.push('/Sections/overview') }
      ]);
    }, 1000);
  };

  return (
    <View className="flex-1 items-center justify-center bg-white px-6">
      <Text className="text-3xl font-JakartaBold text-secondary-800 mb-4 text-center">
        Order Your Delivery Kit
      </Text>
      <Text className="text-base font-JakartaMedium text-secondary-600 mb-8 text-center">
        Get your Swiggy delivery kit delivered to your doorstep.
      </Text>
      <TouchableOpacity
        onPress={handleOrderKit}
        className="bg-primary-500 py-4 rounded-xl items-center w-full"
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-white font-JakartaSemiBold text-lg">Order Kit</Text>
        )}
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => router.push('/Sections/overview')}
        className="mt-4"
      >
        <Text className="text-primary-500 font-JakartaSemiBold text-lg">Skip for now</Text>
      </TouchableOpacity>
    </View>
  );
}
