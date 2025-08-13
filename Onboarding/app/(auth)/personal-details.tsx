import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import InputField from '../../components/InputField';
import { useAuthStore } from '../../stores/auth.store';
import { Picker } from '@react-native-picker/picker';

export default function PersonalDetails() {
  const router = useRouter();
  const { setRiderData } = useAuthStore();

  const [form, setForm] = useState({
    name: '',
    phone: '',
    vehicleType: 'Petrol',
  });
  const [errors, setErrors] = useState({
    name: '',
    phone: '',
  });
  const [loading, setLoading] = useState(false);

  const validate = () => {
    let valid = true;
    let newErrors = { name: '', phone: '' };

    if (!form.name) {
      newErrors.name = 'Name is required.';
      valid = false;
    }
    if (!form.phone) {
      newErrors.phone = 'Phone number is required.';
      valid = false;
    } else if (!/^\d{10}$/.test(form.phone)) {
      newErrors.phone = 'Phone number must be 10 digits.';
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
        setRiderData(form);
        setLoading(false);
        router.push('/auth/document-verification');
      }, 1000);
    }
  };

  return (
    <ScrollView className="flex-1 bg-white px-6 pt-8 pb-8" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
      <View className="mb-8">
        <Text className="text-3xl font-JakartaBold text-secondary-800 mb-2">
          Step 1: Personal Details
        </Text>
        <View className="h-2 bg-gray-200 rounded-full">
          <View className="w-1/3 h-2 bg-primary-500 rounded-full" />
        </View>
      </View>
      <InputField
        label="Full Name"
        placeholder="Enter your full name"
        value={form.name}
        onChangeText={(text) => setForm({ ...form, name: text })}
        error={errors.name}
      />
      <InputField
        label="Phone Number"
        placeholder="Enter your phone number"
        value={form.phone}
        onChangeText={(text) => setForm({ ...form, phone: text })}
        keyboardType="phone-pad"
        error={errors.phone}
      />
      <View className="mb-6">
        <Text className="mb-2 text-secondary-800 font-JakartaSemiBold text-base">
          Vehicle Type
        </Text>
        <View className="border-2 border-primary-200 rounded-xl bg-white shadow-sm">
          <Picker
            selectedValue={form.vehicleType}
            onValueChange={(itemValue) => setForm({ ...form, vehicleType: itemValue })}
            style={{
              height: 50,
              fontFamily: 'Jakarta-Medium',
              color: '#1F2937'
            }}
          >
            <Picker.Item label="Petrol" value="Petrol" />
            <Picker.Item label="Electric" value="Electric" />
          </Picker>
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
    </ScrollView>
  );
}
