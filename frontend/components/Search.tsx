import { View, Text, TextInput, Image, TouchableOpacity } from "react-native";
import React, { memo } from "react";
import { icons } from "@/constants";
import { images } from "@/constants/images";
import { wp, hp, fs, isTablet } from "@/lib/responsive";

interface SearchBarProps {
  placeholder: string; // Default placeholder text
  onPress?: () => void; // Action when the search bar is pressed
  value?: string; // Current input value
  onChangeText?: (text: string) => void; // Function triggered on text change
  onEndEditing?: () => void; // Function triggered when input is submitted
}

const Search = memo(({
  placeholder,
  onPress,
  value,
  onChangeText,
  onEndEditing,
}: SearchBarProps) => {
  return (
    <View 
      className="flex-row items-center bg-white rounded-xl shadow px-3"
      style={{ 
        height: isTablet() ? hp(7) : hp(6.5),
        minHeight: 50
      }}
    >
      <TextInput
        className="flex-1 text-black px-2"
        style={{ fontSize: fs(14) }}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        onEndEditing={onEndEditing}
        onFocus={onPress} // Triggers on press
        placeholderTextColor="#999"
      />
      <Image 
        source={icons.search} 
        className="tint-black mx-2" 
        style={{ 
          width: wp(6), 
          height: wp(6) 
        }} 
      />
      <View 
        className="bg-gray-200 mx-2" 
        style={{ 
          width: 1, 
          height: wp(6) 
        }} 
      />
      <TouchableOpacity 
        className="rounded-full p-1 mx-1"
        style={{
          width: wp(8),
          height: wp(8),
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Image 
          source={images.microphone} 
          style={{ 
            width: wp(5), 
            height: wp(5),
            tintColor: '#FF6600' 
          }} 
        />
      </TouchableOpacity>
    </View>
  );
});

Search.displayName = 'Search';

export default Search;
