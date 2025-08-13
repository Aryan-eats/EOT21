import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, ScrollView, StatusBar } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import InputField from '../../components/InputField';
import { useAuthStore } from '../../stores/auth.store';
import { redirectToDeliveryApp } from '../../services/linking';

export default function SignUp() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [aadharVerified, setAadharVerified] = useState(false);
  const { setRiderData } = useAuthStore();
  
  const [form, setForm] = useState({
    name: '',
    phone: '',
    vehicleType: 'Petrol',
    aadhar: '',
    accountNumber: '',
    accountHolder: '',
    ifsc: ''
  });

  const handleNext = () => {
    if (!form.name || !form.phone || !form.vehicleType) {
      Alert.alert('Error', 'Please fill all fields.');
      return;
    }
    setStep(2);
  };

  const handleAadharVerify = () => {
    if (!form.aadhar) {
      Alert.alert('Error', 'Please enter your Aadhar number to verify.');
      return;
    }
    // Simulate verification
    setAadharVerified(true);
    Alert.alert('Success', 'Aadhar verified!');
  };

  const handleSignUp = async () => {
    if (!form.aadhar || !aadharVerified || !form.accountNumber || !form.accountHolder || !form.ifsc) {
      Alert.alert('Error', 'Please fill all fields and verify Aadhar.');
      return;
    }

    // Store rider data
    const riderData = {
      name: form.name,
      phone: form.phone,
      vehicleType: form.vehicleType,
      aadhar: form.aadhar
    };
    setRiderData(riderData);

    // Redirect to onboarding steps which will handle app switching
    router.replace('/auth/onboarding-steps');
  };

  // ... rest of the component remains the same ...
  return (
    <ScrollView className="flex-1 bg-gradient-to-b from-primary-100 to-general-500 px-6 pt-8 pb-8" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
      {/* ... existing JSX ... */}
    </ScrollView>
  );
}