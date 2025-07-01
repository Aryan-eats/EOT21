import { View, Text, SafeAreaView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import React from "react";

export default function ReviewRatingScreen() {
  const router = useRouter();
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row items-center p-4">
        <TouchableOpacity onPress={() => router.back()} className="mr-2">
          <Text className="text-2xl">←</Text>
        </TouchableOpacity>
        <Text className="text-2xl font-bold">Reviews and Ratings</Text>
      </View>
      <View className="flex-1 items-center justify-center px-4">
        <Text className="text-lg text-gray-700 mb-2">This is the Review and Rating screen.</Text>
        <Text className="text-base text-gray-500">You can display user reviews, ratings, and a form to submit new reviews here.</Text>
      </View>
    </SafeAreaView>
  );
} 