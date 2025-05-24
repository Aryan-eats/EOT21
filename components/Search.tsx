import { View, Text, TextInput, Image, TouchableOpacity } from "react-native";
import React from "react";
import { icons } from "@/constants";
import { images } from "@/constants/images";

interface SearchBarProps {
  placeholder: string; // Default placeholder text
  onPress?: () => void; // Action when the search bar is pressed
  value?: string; // Current input value
  onChangeText?: (text: string) => void; // Function triggered on text change
  onEndEditing?: () => void; // Function triggered when input is submitted
}

const Search = ({
  placeholder,
  onPress,
  value,
  onChangeText,
  onEndEditing,
}: SearchBarProps) => {
  return (
    <View className="flex-row items-center bg-white rounded-xl h-14 shadow px-2">
      <TextInput
        className="flex-1 text-base text-black px-2"
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        onEndEditing={onEndEditing}
        onFocus={onPress} // Triggers on press
        placeholderTextColor="gray"
      />
      <Image source={icons.search} className="w-6 h-6 tint-black mx-2" />
      <View className="w-px h-6 bg-gray-200 mx-2" />
      <View className="rounded-full p-1 mx-2">
        <Image source={images.microphone} className="w-5 h-5" style={{ tintColor: '#FF6600' }} />
      </View>
    </View>
  );
};

export default Search;
