import { View, Text, SafeAreaView, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import React from "react";
import { coupons } from "../../constants/ResData";

export default function CouponsScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="flex-row items-center p-4 mt-10 bg-white">
        <TouchableOpacity onPress={() => router.back()} className="mr-2">
          <Text className="text-2xl">←</Text>
        </TouchableOpacity>
        <Text className="text-2xl font-bold">Available Coupons</Text>
      </View>

      <ScrollView className="flex-1 px-4 py-2">
        {coupons.map((coupon) => (
          <View key={coupon.id} className="bg-white rounded-xl p-4 mb-4 shadow-sm">
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-lg font-bold text-orange-500">{coupon.code}</Text>
              <Text className="text-xl font-bold text-orange-500">{coupon.discount}</Text>
            </View>
            <Text className="text-gray-700 mb-2">{coupon.description}</Text>
            <View className="flex-row justify-between items-center mt-2">
              <Text className="text-sm text-gray-500">Min. order: {coupon.minOrder}</Text>
              <Text className="text-sm text-gray-500">Valid till: {coupon.validUntil}</Text>
            </View>
            <TouchableOpacity 
              className="bg-orange-500 rounded-lg py-2 mt-3"
              onPress={() => {
                // TODO: Implement coupon application logic
                router.back();
              }}
            >
              <Text className="text-white text-center font-semibold">Apply Coupon</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
} 