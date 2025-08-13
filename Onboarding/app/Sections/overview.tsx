import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/stores/auth.store';

export default function OverviewSection() {
  const router = useRouter();
  const { riderData } = useAuthStore();

  const handleConfirm = () => {
    Alert.alert(
      'Registration Complete!',
      'Your application has been submitted successfully. We will now redirect you to the delivery app.',
      [
        {
          text: 'OK',
          onPress: () => {
            Linking.openURL('https://play.google.com/store/apps/details?id=com.deliveryapp');
          }
        }
      ]
    );
  };

  const InfoCard = ({ title, children, onEdit }: { title: string; children: React.ReactNode; onEdit?: () => void }) => (
    <View className="bg-white rounded-2xl p-6 mb-4 shadow-sm border border-gray-100">
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-lg font-JakartaSemiBold text-secondary-800">{title}</Text>
        {onEdit && (
          <TouchableOpacity onPress={onEdit} className="flex-row items-center">
            <Ionicons name="pencil" size={16} color="#FF6600" />
            <Text className="text-primary-500 font-JakartaMedium text-sm ml-1">Edit</Text>
          </TouchableOpacity>
        )}
      </View>
      {children}
    </View>
  );

  const InfoRow = ({ label, value, icon }: { label: string; value: string; icon?: any }) => (
    <View className="flex-row items-center justify-between py-2 border-b border-gray-50 last:border-b-0">
      <View className="flex-row items-center flex-1">
        {icon && (
          <Ionicons name={icon} size={16} color="#6B7280" style={{ marginRight: 8 }} />
        )}
        <Text className="text-secondary-600 font-JakartaMedium flex-1">{label}</Text>
      </View>
      <Text className="text-secondary-800 font-JakartaSemiBold text-right">{value}</Text>
    </View>
  );

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="px-6 mt-10 py-8">
        <View className="flex-row justify-between items-center mb-8">
          <Text className="text-3xl font-JakartaBold text-secondary-800">
            Review Information
          </Text>
          <TouchableOpacity onPress={() => router.push('/Sections/settings')}>
            <Ionicons name="settings-outline" size={24} color="#6B7280" />
          </TouchableOpacity>
        </View>

        <InfoCard title="Personal Information" onEdit={() => router.push('/auth/personal-details')}>
          <InfoRow label="Full Name" value={riderData.name} icon="person" />
          <InfoRow label="Phone Number" value={riderData.phone} icon="call" />
          <InfoRow label="Vehicle Type" value={riderData.vehicleType} icon="car" />
          <InfoRow label="Gender" value={riderData.gender} icon="person-circle" />
        </InfoCard>

        <InfoCard title="Verification Documents" onEdit={() => router.push('/Sections/profile')}>
          <InfoRow label="Aadhar Number" value={riderData.aadhar} icon="card" />
          <InfoRow label="PAN Number" value={riderData.panNumber} icon="card-outline" />
        </InfoCard>

        <InfoCard title="Banking Information" onEdit={() => router.push('/auth/bank-details')}>
          <InfoRow label="Account Number" value={riderData.accountNumber} icon="card" />
          <InfoRow label="Account Holder" value={riderData.accountHolder} icon="person" />
          <InfoRow label="IFSC Code" value={riderData.ifsc} icon="business" />
        </InfoCard>

        <InfoCard title="Work Information" onEdit={() => router.push('/Sections/work')}>
          <InfoRow label="Work Area" value={riderData.workArea} icon="location" />
          <InfoRow label="Work Time" value={riderData.workTime} icon="time" />
        </InfoCard>

        <View className="space-y-3 mt-4">
          <TouchableOpacity 
            onPress={handleConfirm}
            className="bg-primary-500 py-4 rounded-xl items-center shadow-lg shadow-primary-500/30"
          >
            <Text className="text-white font-JakartaSemiBold text-lg">Confirm & Proceed</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}