import {  Text, View, StyleSheet } from 'react-native'
import React from 'react'


interface HeadingWithSeparatorProps {
    text: string;
    isBorder?: boolean;
  }
const HeadingWithSeparator = ({ text, isBorder=false }: HeadingWithSeparatorProps) => {
    return (
        <View className={`w-full h-10 flex flex-row justify-center items-center gap-4`}>
          <View className={`w-1/2 border-b border-b-gray-400`} />
          <Text className={`text-lg text-black ${isBorder && `border rounded-lg px-4 border-primary`}`}>{text}</Text>
          <View className={`w-1/2 border-b border-b-gray-400`} />
        </View>
      );
    };


export default HeadingWithSeparator

