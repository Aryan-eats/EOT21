import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/stores/auth.store';

export default function WorkSection() {
  const router = useRouter();
  const { riderData, setRiderData } = useAuthStore();
  const [workTime, setWorkTime] = useState('');
  const [loading, setLoading] = useState(false);

  const area = 'Greater Noida';
  const distance = '10 km';
  const joiningBonus = '₹6300';
  const weeklyEarnings = 'Upto ₹13,000 weekly earnings';

  const handleNext = () => {
    if (!workTime) {
      Alert.alert('Error', 'Please select your preferred work time.');
      return;
    }
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setRiderData({ ...riderData, workTime, area, distance, joiningBonus, weeklyEarnings });
      setLoading(false);
      router.push('/Sections/kit');
    }, 1000);
  };

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="px-6 mt-10 py-8">
        <View className="mb-8">
          <Text className="text-3xl font-JakartaBold text-secondary-800 mb-2">
            Work Information
          </Text>
          <Text className="text-base font-JakartaMedium text-secondary-600">
            Choose your work preferences
          </Text>
        </View>

        <View className="border border-gray-200 rounded-xl p-4 mb-6 shadow-sm bg-white">
          <View className="flex-row items-center justify-between">
            <Text className="text-lg font-semibold text-gray-900">{area}</Text>
            <Text className="text-xs text-gray-500">{distance}</Text>
          </View>
          <View className="flex-row items-center mt-2">
            <Text className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-semibold mr-2">
              {joiningBonus}
            </Text>
            <Text className="text-xs text-green-700 font-medium">Joining bonus</Text>
          </View>
          <Text className="text-xs text-gray-600 mt-2">{weeklyEarnings}</Text>
        </View>

        <View className="border border-gray-200 rounded-xl p-4 mb-6 shadow-sm bg-white">
          <Text className="text-lg font-semibold text-gray-900 mb-3">Choose your preferred work time</Text>
          <View className="flex-row space-x-4">
            <TouchableOpacity
              className={`flex-1 border rounded-lg py-2 items-center justify-center ${workTime === 'Full Time' ? 'border-orange-500 bg-orange-50' : 'border-gray-300'}`}
              onPress={() => setWorkTime('Full Time')}
            >
              <Text className="text-base text-gray-800">Full Time</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`flex-1 border rounded-lg py-2 items-center justify-center ${workTime === 'Weekends' ? 'border-orange-500 bg-orange-50' : 'border-gray-300'}`}
              onPress={() => setWorkTime('Weekends')}
            >
              <Text className="text-base text-gray-800">Weekends</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          onPress={handleNext}
          className="bg-primary-500 py-4 rounded-xl items-center"
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white font-JakartaSemiBold text-lg">Next</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
