import React from 'react';
import { View, Text, TextInput, TextInputProps } from 'react-native';

interface InputFieldProps extends TextInputProps {
  label: string;
  error?: string;
  className?: string;
}

export default function InputField({ 
  label, 
  error,
  className = "mb-4", 
  ...textInputProps 
}: InputFieldProps) {
  return (
    <View className={className}>
      {label && (
        <Text className="mb-2 text-secondary-800 font-JakartaSemiBold text-base">
          {label}
        </Text>
      )}
      <View className={`flex-row items-center border-2 ${error ? 'border-danger-500' : 'border-primary-200'} rounded-xl px-4 py-3 bg-white shadow-sm`}>
        <TextInput
          className="flex-1 font-JakartaMedium text-base text-secondary-800"
          placeholderTextColor="#AAAAAA"
          {...textInputProps}
        />
      </View>
      {error && (
        <Text className="mt-1 text-danger-500 font-JakartaMedium text-sm">
          {error}
        </Text>
      )}
    </View>
  );
} 