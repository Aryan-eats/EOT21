import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import InputField from '../../components/InputField';
import { useAuthStore } from '../../stores/auth.store';

export default function DocumentVerification() {
  const router = useRouter();
  const { riderData, setRiderData } = useAuthStore();
  const [aadhar, setAadhar] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [aadharVerified, setAadharVerified] = useState(false);

  const validateAadhar = () => {
    if (!/^\d{12}$/.test(aadhar)) {
      setError('Aadhar number must be 12 digits.');
      return false;
    }
    setError('');
    return true;
  };

  const handleAadharVerify = () => {
    if (validateAadhar()) {
      setVerifyLoading(true);
      // Simulate API call
      setTimeout(() => {
        setVerifyLoading(false);
        setAadharVerified(true);
        Alert.alert('Success', 'Aadhar verified!');
      }, 1000);
    }
  };

  const handleNext = () => {
    if (!aadharVerified) {
      Alert.alert('Error', 'Please verify your Aadhar.');
      return;
    }
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setRiderData({ ...riderData, aadhar });
      setLoading(false);
      router.push('/auth/bank-details');
    }, 1000);
  };

  return (
    <ScrollView className="flex-1 bg-white px-6 pt-8 pb-8" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
      <View className="mb-8">
        <Text className="text-3xl font-JakartaBold text-secondary-800 mb-2">
          Step 2: Document Verification
        </Text>
        <View className="h-2 bg-gray-200 rounded-full">
          <View className="w-2/3 h-2 bg-primary-500 rounded-full" />
        </View>
      </View>
      <InputField
        label="Aadhar Number"
        placeholder="Enter your 12-digit Aadhar number"
        value={aadhar}
        onChangeText={setAadhar}
        keyboardType="numeric"
        error={error}
        maxLength={12}
      />
      <TouchableOpacity
        onPress={handleAadharVerify}
        className="bg-secondary-500 py-4 rounded-xl items-center mb-4"
        disabled={verifyLoading || aadharVerified}
      >
        {verifyLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-white font-JakartaSemiBold text-lg">{aadharVerified ? 'Aadhar Verified' : 'Verify Aadhar'}</Text>
        )}
      </TouchableOpacity>
      <TouchableOpacity
        onPress={handleNext}
        className={`bg-primary-500 py-4 rounded-xl items-center ${!aadharVerified ? 'opacity-50' : ''}`}
        disabled={!aadharVerified || loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-white font-JakartaSemiBold text-lg">Next</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}
