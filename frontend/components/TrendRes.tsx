import React from "react";
import { View, Text, Image, ScrollView, TouchableOpacity, FlatList } from "react-native";
import { ResData } from "@/constants/ResData"; // Adjust the path accordingly

const RestaurantCard = ({ restaurant }) => {
  return (
    <View className="w-11/12 bg-white rounded-2xl shadow-md mx-auto mt-4 pb-4">
      
      {/* Cover Image */}
      <Image
        source={restaurant.imageSource}
        className="w-full h-48 rounded-t-2xl"
        resizeMode="cover"
      />

      {/* Titles */}
      <View className="px-4 mt-2">
        <Text className="text-lg font-bold">{restaurant.title}</Text>
        <Text className="text-sm text-gray-600">{restaurant.firstSubTitle}</Text>
        <Text className="text-sm text-gray-600 mb-2">{restaurant.secondSubTitle}</Text>
      </View>

      {/* Popular Items */}
      <View className="px-4">
        <Text className="font-semibold text-base mb-2">Popular items</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {restaurant.items.map((item, idx) => (
            <View key={idx} className="mr-3 bg-white rounded-xl shadow-sm p-2 w-32">
              <Image source={item.imageSource} className="w-full h-20 rounded-md" resizeMode="cover" />
              <Text className="mt-1 text-sm font-medium">{item.name}</Text>
              <Text className="text-xs text-gray-500">{item.price}</Text>
              <TouchableOpacity className="border border-orange-500 rounded-md py-1 px-2 mt-1 self-start">
                <Text className="text-orange-500 text-xs font-semibold">Add +</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Footer: Time, Distance, Button */}
      <View className="flex-row items-center justify-between px-4 mt-4">
        <View>
          <Text className="text-sm text-gray-600">{restaurant.time} • {restaurant.distance}</Text>
        </View>
        <TouchableOpacity className="bg-orange-500 px-4 py-2 rounded-md">
          <Text className="text-white text-sm font-semibold">{restaurant.buttonTitle}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// const RestaurantList = () => {
//   return (
//     <FlatList
//       data={ResData}
//       keyExtractor={(_, index) => index.toString()}
//       renderItem={({ item }) => <RestaurantCard restaurant={item} />}
//       showsVerticalScrollIndicator={false}
//     />
//   );
// };

export default RestaurantCard;
