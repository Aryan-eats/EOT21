import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function SettingsSection() {
  const router = useRouter();

  const menuItems = [
    { title: 'Edit Profile', screen: '/Sections/profile', icon: 'person-outline' },
    { title: 'Work Preferences', screen: '/Sections/work', icon: 'briefcase-outline' },
    { title: 'Order Kit', screen: '/Sections/kit', icon: 'cube-outline' },
    { title: 'Logout', screen: '/auth/personal-details', icon: 'log-out-outline' },
  ];

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="px-6 mt-10 py-8">
        <Text className="text-3xl font-JakartaBold text-secondary-800 mb-8">
          Settings
        </Text>

        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => router.push(item.screen)}
            className="bg-white rounded-2xl p-6 mb-4 shadow-sm border border-gray-100 flex-row justify-between items-center"
          >
            <View className="flex-row items-center">
              <Ionicons name={item.icon as any} size={24} color="#FF6600" />
              <Text className="text-lg font-JakartaSemiBold text-secondary-800 ml-4">{item.title}</Text>
            </View>
            <Ionicons name="chevron-forward-outline" size={24} color="#6B7280" />
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}
