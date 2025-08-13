import React from "react";
import { Text, View, ScrollView, TouchableOpacity, Image, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'expo-router';
import { addItem } from '../../slices/cartSlice';
import { wp, hp, fs, isTablet } from "@/lib/responsive";
import { images } from "@/constants/images";

export default function ReOrder() {
  const orderHistory = useSelector((state: any) => state.cart.orderHistory);
  const dispatch = useDispatch();
  const router = useRouter();

  const handleReorderItem = (item: any, restaurant: string) => {
    dispatch(addItem({
      ...item,
      restaurant: restaurant,
    }));
  };

  const handleReorderAll = (order: any) => {
    order.items.forEach((item: any) => {
      dispatch(addItem({
        ...item,
        restaurant: order.restaurant,
      }));
    });
    router.push('/(root)/(tabs)/Cart');
  };

  const renderOrderItem = ({ item: order }: { item: any }) => (
    <View className="bg-white rounded-2xl p-4 mb-4 mx-4 shadow-sm">
      <View className="flex-row justify-between items-start mb-3">
        <View className="flex-1">
          <Text className="font-bold text-gray-900" style={{ fontSize: fs(16) }}>
            {order.restaurant}
          </Text>
          <Text className="text-gray-500" style={{ fontSize: fs(12) }}>
            {new Date(order.orderTime).toLocaleDateString()} • {order.items.length} items
          </Text>
        </View>
        <View className="items-end">
          <Text className="font-bold" style={{ color: '#FF6600', fontSize: fs(16) }}>
            ₹{order.total}
          </Text>
          <View className={`px-2 py-1 rounded-full ${
            order.status === 'delivered' ? 'bg-green-100' : 'bg-orange-100'
          }`}>
            <Text className={`text-xs font-semibold ${
              order.status === 'delivered' ? 'text-green-700' : 'text-orange-700'
            }`}>
              {order.status === 'delivered' ? 'Delivered' : 'In Progress'}
            </Text>
          </View>
        </View>
      </View>

      {/* Order Items Preview */}
      <View className="mb-3">
        {order.items.slice(0, 2).map((item: any, index: number) => (
          <View key={index} className="flex-row items-center py-1">
            <Text className="text-gray-600" style={{ fontSize: fs(14) }}>
              {item.quantity}x {item.name}
            </Text>
          </View>
        ))}
        {order.items.length > 2 && (
          <Text className="text-gray-400" style={{ fontSize: fs(12) }}>
            +{order.items.length - 2} more items
          </Text>
        )}
      </View>

      {/* Action Buttons */}
      <View className="flex-row space-x-3">
        <TouchableOpacity
          className="flex-1 border border-orange-500 rounded-xl py-3"
          onPress={() => router.push('/(root)/order-tracking')}
        >
          <Text className="text-center text-orange-500 font-semibold" style={{ fontSize: fs(14) }}>
            Track Order
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="flex-1 rounded-xl py-3"
          style={{ backgroundColor: '#FF6600' }}
          onPress={() => handleReorderAll(order)}
        >
          <Text className="text-center text-white font-semibold" style={{ fontSize: fs(14) }}>
            Reorder
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-4 py-4 shadow-sm" style={{ marginTop: hp(2) }}>
        <Text className="font-bold text-gray-900" style={{ fontSize: fs(24) }}>
          Order History
        </Text>
        <Text className="text-gray-500" style={{ fontSize: fs(14) }}>
          Reorder your favorite meals
        </Text>
      </View>

      {orderHistory.length === 0 ? (
        <View className="flex-1 items-center justify-center px-8">
          <Image 
            source={images.home} 
            className="mb-6 opacity-50"
            style={{ width: wp(40), height: wp(40) }}
            resizeMode="contain"
          />
          <Text className="text-center text-gray-500 mb-2" style={{ fontSize: fs(18) }}>
            No orders yet
          </Text>
          <Text className="text-center text-gray-400 mb-6" style={{ fontSize: fs(14) }}>
            When you place your first order, it will appear here
          </Text>
          <TouchableOpacity
            className="rounded-xl px-8 py-4"
            style={{ backgroundColor: '#FF6600' }}
            onPress={() => router.push('/(root)/(tabs)/home')}
          >
            <Text className="text-white font-bold" style={{ fontSize: fs(16) }}>
              Start Ordering
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={orderHistory}
          renderItem={renderOrderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingVertical: hp(2), paddingBottom: hp(12) }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}
