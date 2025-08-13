import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, ScrollView, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import InputField from '@/components/InputField';
import { useAuthStore } from '@/stores/auth.store';

export default function ProfileSection() {
  const router = useRouter();
  const { riderData, setRiderData } = useAuthStore();
  const [gender, setGender] = useState('');
  const [panNumber, setPanNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ panNumber: '' });

  const validate = () => {
    let valid = true;
    let newErrors = { panNumber: '' };

    if (!panNumber) {
      newErrors.panNumber = 'PAN number is required.';
      valid = false;
    } else if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(panNumber.toUpperCase())) {
      newErrors.panNumber = 'Invalid PAN number format.';
      valid = false;
    }
    if (!gender) {
      Alert.alert('Error', 'Please select your gender');
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleNext = () => {
    if (validate()) {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        setRiderData({ ...riderData, gender, panNumber });
        setLoading(false);
        router.push('/Sections/work');
      }, 1000);
    }
  };

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="px-6 mt-10 py-8">
        <View className="mb-8">
          <Text className="text-3xl font-JakartaBold text-secondary-800 mb-2">
            Complete Your Profile
          </Text>
          <Text className="text-base font-JakartaMedium text-secondary-600">
            Please provide the following information to continue
          </Text>
        </View>

        <View className="mb-6">
          <Text className="mb-2 text-secondary-800 font-JakartaSemiBold text-base">
            Gender *
          </Text>
          <View className="border-2 border-primary-200 rounded-xl bg-white shadow-sm">
            <Picker
              selectedValue={gender}
              onValueChange={(itemValue) => setGender(itemValue)}
              style={{ 
                height: 50, 
                fontFamily: 'Jakarta-Medium',
                color: '#1F2937'
              }}
            >
              <Picker.Item label="Select your gender" value="" />
              <Picker.Item label="Male" value="male" />
              <Picker.Item label="Female" value="female" />
              <Picker.Item label="Other" value="other" />
              <Picker.Item label="Prefer not to say" value="prefer_not_to_say" />
            </Picker>
          </View>
        </View>

        <View className="mb-6">
          <InputField
            label="PAN Number *"
            placeholder="Enter your PAN number (e.g., ABCDE1234F)"
            value={panNumber}
            onChangeText={setPanNumber}
            autoCapitalize="characters"
            maxLength={10}
            icon="card"
            error={errors.panNumber}
          />
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
