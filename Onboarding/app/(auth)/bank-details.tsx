import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import InputField from '../../components/InputField';
import { useAuthStore } from '../../stores/auth.store';

export default function BankDetails() {
  const router = useRouter();
  const { riderData, setRiderData } = useAuthStore();

  const [form, setForm] = useState({
    accountNumber: '',
    accountHolder: '',
    ifsc: ''
  });
  const [errors, setErrors] = useState({
    accountNumber: '',
    accountHolder: '',
    ifsc: ''
  });
  const [loading, setLoading] = useState(false);

  const validate = () => {
    let valid = true;
    let newErrors = { accountNumber: '', accountHolder: '', ifsc: '' };

    if (!form.accountNumber) {
      newErrors.accountNumber = 'Account number is required.';
      valid = false;
    }
    if (!form.accountHolder) {
      newErrors.accountHolder = 'Account holder name is required.';
      valid = false;
    }
    if (!form.ifsc) {
      newErrors.ifsc = 'IFSC code is required.';
      valid = false;
    } else if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(form.ifsc)) {
      newErrors.ifsc = 'Invalid IFSC code format.';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSignUp = async () => {
    if (validate()) {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        setRiderData({ ...riderData, ...form });
        setLoading(false);
        router.replace('/Sections/profile');
      }, 1000);
    }
  };

  return (
    <ScrollView className="flex-1 bg-white px-6 pt-8 pb-8" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
      <View className="mb-8">
        <Text className="text-3xl font-JakartaBold text-secondary-800 mb-2">
          Step 3: Bank Details
        </Text>
        <View className="h-2 bg-gray-200 rounded-full">
          <View className="w-full h-2 bg-primary-500 rounded-full" />
        </View>
      </View>
      <InputField
        label="Account Number"
        placeholder="Enter your account number"
        value={form.accountNumber}
        onChangeText={(text) => setForm({ ...form, accountNumber: text })}
        keyboardType="numeric"
        error={errors.accountNumber}
      />
      <InputField
        label="Account Holder Name"
        placeholder="Enter account holder name"
        value={form.accountHolder}
        onChangeText={(text) => setForm({ ...form, accountHolder: text })}
        error={errors.accountHolder}
      />
      <InputField
        label="IFSC Code"
        placeholder="Enter IFSC code"
        value={form.ifsc}
        onChangeText={(text) => setForm({ ...form, ifsc: text.toUpperCase() })}
        autoCapitalize="characters"
        error={errors.ifsc}
      />
      <TouchableOpacity
        onPress={handleSignUp}
        className="bg-primary-500 py-4 rounded-xl items-center"
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-white font-JakartaSemiBold text-lg">Finish Sign Up</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}
