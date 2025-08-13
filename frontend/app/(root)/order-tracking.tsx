import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  SafeAreaView,
  Dimensions,
  Animated,
  Modal,
} from 'react-native';
import { useRouter } from 'expo-router';
import { icons } from '@/constants';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface OrderStatus {
  id: string;
  title: string;
  description: string;
  time: string;
  completed: boolean;
  active: boolean;
}

const OrderTracking = () => {
  const router = useRouter();
  const [showCallModal, setShowCallModal] = useState(false);
  const [progress] = useState(new Animated.Value(0));
  const [currentStep, setCurrentStep] = useState(2);

  const orderStatuses: OrderStatus[] = [
    {
      id: '1',
      title: 'Order Confirmed',
      description: 'Your order has been placed successfully',
      time: '2:45 PM',
      completed: true,
      active: false
    },
    {
      id: '2',
      title: 'Preparing',
      description: 'Restaurant is preparing your delicious meal',
      time: '2:50 PM',
      completed: true,
      active: true
    },
    {
      id: '3',
      title: 'Out for Delivery',
      description: 'Your order is on the way',
      time: '',
      completed: false,
      active: false
    },
    {
      id: '4',
      title: 'Delivered',
      description: 'Enjoy your meal!',
      time: '',
      completed: false,
      active: false
    }
  ];

  // Simulate order progress
  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentStep < 4) {
        setCurrentStep(currentStep + 1);
        Animated.timing(progress, {
          toValue: (currentStep + 1) / 4,
          duration: 1000,
          useNativeDriver: false,
        }).start();
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [currentStep]);

  const deliveryPerson = {
    name: 'Rajesh Kumar',
    phone: '+91 98765 43210',
    rating: '4.8',
    image: '👨‍🍳', // Using emoji for demo
    vehicle: 'Honda Activa',
    eta: '15-20 mins'
  };

  const restaurantInfo = {
    name: 'Restaurant 1',
    address: 'S3-910, 9th Floor, Sun 3, Migsun Ultimo',
    phone: '+91 98765 43210'
  };

  const orderDetails = {
    orderId: '#ORD12345',
    items: [
      { name: 'Spicy Burger', quantity: 2, price: 299 },
      { name: 'French Fries', quantity: 1, price: 149 }
    ],
    total: 747,
    deliveryAddress: 'S3-910, 9th Floor, Sun 3, Migsun Ultimo'
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 20 }}>
        {/* Header */}
        <View className="bg-white px-4 py-4 flex-row items-center justify-between mt-8 shadow-sm">
          <View className="flex-row items-center">
            <TouchableOpacity onPress={() => router.back()} className="mr-4">
              <Image source={icons.backArrow} className="w-6 h-6" />
            </TouchableOpacity>
            <Text className="text-xl font-bold text-gray-900">Track Order</Text>
          </View>
          <Text className="text-base font-semibold" style={{ color: '#FF6600' }}>
            {orderDetails.orderId}
          </Text>
        </View>

        {/* Map Placeholder */}
        <View className="bg-white mx-4 mt-4 rounded-2xl overflow-hidden shadow-sm">
          <View 
            className="bg-gradient-to-br from-blue-100 to-green-100 flex-1 items-center justify-center relative"
            style={{ height: 200 }}
          >
            {/* Mock Map Background */}
            <View className="absolute inset-0 bg-blue-50" />
            
            {/* Restaurant Pin */}
            <View className="absolute top-4 left-8 items-center">
              <View className="bg-red-500 p-2 rounded-full">
                <Text className="text-white text-lg">🏪</Text>
              </View>
              <Text className="text-xs mt-1 font-semibold">Restaurant</Text>
            </View>

            {/* Delivery Person Pin */}
            <View className="absolute top-20 right-12 items-center">
              <View className="bg-orange-500 p-2 rounded-full animate-pulse">
                <Text className="text-white text-lg">🛵</Text>
              </View>
              <Text className="text-xs mt-1 font-semibold">Delivery</Text>
            </View>

            {/* Your Location Pin */}
            <View className="absolute bottom-4 right-8 items-center">
              <View className="bg-green-500 p-2 rounded-full">
                <Text className="text-white text-lg">🏠</Text>
              </View>
              <Text className="text-xs mt-1 font-semibold">You</Text>
            </View>

            {/* Delivery Route Line */}
            <View className="absolute top-24 right-16 w-20 h-16 border-2 border-dashed border-orange-400 rounded-br-full opacity-60" />

            <View className="absolute inset-0 items-center justify-center">
              <Text className="text-lg font-bold text-gray-600">Live Tracking Map</Text>
              <Text className="text-sm text-gray-500 mt-1">🗺️ Map integration coming soon</Text>
            </View>
          </View>
        </View>

        {/* Delivery Person Info */}
        <View className="bg-white mx-4 mt-4 rounded-2xl p-4 shadow-sm">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center flex-1">
              <View className="w-12 h-12 bg-orange-100 rounded-full items-center justify-center mr-3">
                <Text className="text-2xl">{deliveryPerson.image}</Text>
              </View>
              <View className="flex-1">
                <Text className="text-lg font-bold text-gray-900">{deliveryPerson.name}</Text>
                <Text className="text-sm text-gray-600">{deliveryPerson.vehicle}</Text>
                <View className="flex-row items-center mt-1">
                  <Text className="text-yellow-500 mr-1">⭐</Text>
                  <Text className="text-sm font-semibold text-gray-700">{deliveryPerson.rating}</Text>
                  <Text className="text-sm text-gray-500 ml-2">• ETA: {deliveryPerson.eta}</Text>
                </View>
              </View>
            </View>
            <TouchableOpacity
              className="bg-green-500 p-3 rounded-full"
              onPress={() => setShowCallModal(true)}
            >
              <Text className="text-white text-lg">📞</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Order Progress */}
        <View className="bg-white mx-4 mt-4 rounded-2xl p-4 shadow-sm">
          <Text className="text-lg font-bold text-gray-900 mb-4">Order Status</Text>
          
          {orderStatuses.map((status, index) => (
            <View key={status.id} className="flex-row items-center mb-4">
              {/* Status Icon */}
              <View className="items-center mr-4">
                <View 
                  className={`w-8 h-8 rounded-full items-center justify-center ${
                    status.completed ? 'bg-green-500' : 
                    status.active ? 'bg-orange-500' : 'bg-gray-300'
                  }`}
                >
                  {status.completed ? (
                    <Text className="text-white text-sm">✓</Text>
                  ) : status.active ? (
                    <View className="w-3 h-3 bg-white rounded-full animate-pulse" />
                  ) : (
                    <View className="w-3 h-3 bg-gray-400 rounded-full" />
                  )}
                </View>
                {index < orderStatuses.length - 1 && (
                  <View className={`w-0.5 h-8 mt-1 ${
                    index < currentStep - 1 ? 'bg-green-500' : 'bg-gray-300'
                  }`} />
                )}
              </View>

              {/* Status Details */}
              <View className="flex-1">
                <Text className={`text-base font-semibold ${
                  status.completed || status.active ? 'text-gray-900' : 'text-gray-500'
                }`}>
                  {status.title}
                </Text>
                <Text className={`text-sm ${
                  status.completed || status.active ? 'text-gray-600' : 'text-gray-400'
                }`}>
                  {status.description}
                </Text>
                {status.time && (
                  <Text className="text-xs text-gray-500 mt-1">{status.time}</Text>
                )}
              </View>
            </View>
          ))}
        </View>

        {/* Order Details */}
        <View className="bg-white mx-4 mt-4 rounded-2xl p-4 shadow-sm">
          <Text className="text-lg font-bold text-gray-900 mb-3">Order Details</Text>
          
          {orderDetails.items.map((item, index) => (
            <View key={index} className="flex-row justify-between items-center mb-2">
              <Text className="text-gray-600 flex-1">{item.quantity}x {item.name}</Text>
              <Text className="text-gray-900 font-semibold">₹{item.price}</Text>
            </View>
          ))}
          
          <View className="h-px bg-gray-200 my-3" />
          <View className="flex-row justify-between items-center">
            <Text className="text-lg font-bold text-gray-900">Total</Text>
            <Text className="text-lg font-bold" style={{ color: '#FF6600' }}>₹{orderDetails.total}</Text>
          </View>
        </View>

        {/* Restaurant Info */}
        <View className="bg-white mx-4 mt-4 rounded-2xl p-4 shadow-sm">
          <Text className="text-lg font-bold text-gray-900 mb-3">Restaurant Details</Text>
          <Text className="text-base font-semibold text-gray-900">{restaurantInfo.name}</Text>
          <Text className="text-sm text-gray-600 mt-1">{restaurantInfo.address}</Text>
          <TouchableOpacity className="mt-3 self-start">
            <Text className="text-base font-semibold" style={{ color: '#FF6600' }}>Call Restaurant</Text>
          </TouchableOpacity>
        </View>

        {/* Help Section */}
        <View className="bg-white mx-4 mt-4 rounded-2xl p-4 shadow-sm">
          <Text className="text-lg font-bold text-gray-900 mb-3">Need Help?</Text>
          <View className="space-y-3">
            <TouchableOpacity className="flex-row items-center py-2">
              <Text className="text-xl mr-3">📞</Text>
              <Text className="text-base text-gray-700">Call Customer Support</Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex-row items-center py-2">
              <Text className="text-xl mr-3">💬</Text>
              <Text className="text-base text-gray-700">Chat with us</Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex-row items-center py-2">
              <Text className="text-xl mr-3">❌</Text>
              <Text className="text-base text-red-500">Cancel Order</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Call Modal */}
      <Modal
        visible={showCallModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCallModal(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white rounded-2xl p-6 w-80">
            <Text className="text-lg font-bold mb-4 text-center">Contact Delivery Partner</Text>
            
            <View className="items-center mb-6">
              <View className="w-20 h-20 bg-orange-100 rounded-full items-center justify-center mb-3">
                <Text className="text-4xl">{deliveryPerson.image}</Text>
              </View>
              <Text className="text-xl font-bold">{deliveryPerson.name}</Text>
              <Text className="text-gray-600">{deliveryPerson.phone}</Text>
            </View>

            <View className="flex-row space-x-3">
              <TouchableOpacity className="flex-1 bg-green-500 rounded-xl py-4 items-center">
                <Text className="text-white font-bold text-lg">📞 Call</Text>
              </TouchableOpacity>
              <TouchableOpacity className="flex-1 bg-blue-500 rounded-xl py-4 items-center">
                <Text className="text-white font-bold text-lg">💬 Message</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              className="mt-4 bg-gray-200 rounded-xl py-3"
              onPress={() => setShowCallModal(false)}
            >
              <Text className="text-center text-gray-700 font-semibold">Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Bottom Action Button */}
      <View className="bg-white px-4 py-4 shadow-lg">
        <TouchableOpacity
          className="rounded-2xl py-4"
          style={{ backgroundColor: '#FF6600' }}
          onPress={() => router.push('/(root)/(tabs)/home')}
        >
          <Text className="text-center text-white font-bold text-lg">Order Again</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default OrderTracking;
