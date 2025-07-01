import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
  Share,
  SafeAreaView,
  Modal,
} from "react-native";
import React, { useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { icons } from "@/constants";
import { ResData } from "@/constants/ResData";
import { RestDish } from "@/constants/RestDishes";
import { useDispatch, useSelector } from "react-redux";
import { addItem } from "../slices/cartSlice";
import Search from "@/components/Search";
import { AllRes } from "@/constants/AllRes";

interface Dish {
  name: string;
  price: string;
  imageSource: any;
  restaurant?: string;
  description?: string;
  rating?: string;
  coverPhoto?: any;
  address?: string;
}

export const options = {
  headerShown: false,
};

export default function RestaurantScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const dispatch = useDispatch();
  const cartItems = useSelector((state: any) => state.cart.items);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<'All' | 'Veg' | 'Non-Veg'>('All');

  // Find the restaurant data based on the passed title
  const restaurant = ResData.find((res) => res.title === params.title);
  const dishes = RestDish.filter((dish) =>
    dish.title.includes(params.title as string)
  ).map((dish) => ({
    name: dish.title,
    price: "717", // Example price
    imageSource: dish.imageSource,
    restaurant: params.title as string,
    description:
      "serving of spiced rice topped with crispy chicken pieces, often accompanied by a savory gravy or sauce. This dish offers a balanced combination of protein and carbohydrates more...",
    rating: "4.2",
  }));

  // Find the AllRes data for slotTimings
  const allResData = AllRes.find((res) => res.title === params.title);
  const slotTimings = allResData?.slotTimings || "No slot timings available.";
  const slotTimingsArray = slotTimings.split(",").map(s => s.trim());

  const handleAddToCart = (item: Dish) => {
    if (!restaurant) return;
    if (cartItems.length > 0) {
      const cartRestaurant = cartItems[0].restaurant;
      if (cartRestaurant !== restaurant.title) {
        Alert.alert("Multiple restaurant isn't available right now");
        return;
      }
    }
    dispatch(
      addItem({
        id: `${restaurant.title}-${item.name}`,
        name: item.name,
        price: parseInt(item.price),
        image: item.imageSource,
        restaurant: restaurant.title,
        coverPhoto: restaurant.imageSource,
        address: restaurant.secondSubTitle || "",
      })
    );
  };

  const handleShare = async () => {
    if (!restaurant) return;
    try {
      await Share.share({
        message: `Check out ${restaurant.title} at ${restaurant.secondSubTitle}!`,
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to share restaurant');
    }
  };

  const handleWishlist = () => {
    Alert.alert('Success', 'Added to wishlist!');
  };

  const filteredItems = restaurant ? restaurant.items.filter(item => {
    if (selectedFilter === 'All') return true;
    return item.type === selectedFilter;
  }) : [];

  if (!restaurant) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Restaurant not found</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1">
        {/* Header and Review Section */}
        <View className="flex-row bg-[#F7F7F7] min-h-16 mb-4 mt-12 pt-2">
          {/* Left: Restaurant Info Card (50%) */}
          <View className="rounded-tl-2xl rounded-bl-2xl p-3 justify-between w-1/2">
            <View className="flex-row items-start">
              <TouchableOpacity
                onPress={() => router.back()}
                className="mr-2 mt-1"
              >
                <Image source={icons.backArrow} className="w-8 h-6" />
              </TouchableOpacity>
              {/* Restaurant image hidden */}
              <View className="flex-1 flex-col">
                <Text className="text-xl font-bold">{restaurant.title}</Text>
                <Text className="text-xs font-semibold mt-1">
                  {restaurant.time}, {restaurant.distance}, Alpha
                </Text>
                <Text className="text-xs text-gray-500 mt-1">
                  {restaurant.firstSubTitle}
                </Text>
                <Text className="text-xs text-gray-500">
                  {restaurant.secondSubTitle}
                </Text>
              </View>
            </View>
            <View className="flex-col mt-4 space-y-2">
              <TouchableOpacity 
                onPress={handleShare}
                className="flex-row items-center justify-center bg-[#FFE3C2] px-4 py-3 rounded-md"
              >
                <Text className="text-base font-semibold">Share</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={handleWishlist}
                className="flex-row items-center justify-center bg-[#FFD7B5] px-4 py-3 rounded-md"
              >
                <Text className="text-base font-semibold">Wishlist</Text>
              </TouchableOpacity>
            </View>
            <Text className="text-xs text-green-600 font-semibold mt-2">
              Currently Accepting Orders
            </Text>
          </View>
          {/* Vertical Divider */}
          <View className="w-0.5 bg-gray-300 mx-0 h-5/6 self-center" />
          {/* Right: Review Card (50%) with padding */}
          <View className="w-1/2 p-3 justify-center">
            <TouchableOpacity
              className="bg-white rounded-2xl shadow border border-gray-200 w-full min-h-48 justify-start relative pb-4"
              activeOpacity={0.8}
            >
              <View className="flex-row items-center justify-between px-4 pt-4">
                <Text className="text-base font-bold">Reviews and Ratings</Text>
                <View className="bg-green-500 rounded px-3 py-1 flex-row items-center">
                  <Text className="text-white font-semibold text-base">
                    {restaurant.rating || "4.8"}
                  </Text>
                  <Text className="text-white ml-1 text-base">★</Text>
                </View>
              </View>
              <View className="border-b border-black mx-4 mt-1" />
              <Text className="text-sm text-black px-4 mt-2 leading-5">
                {restaurant.review ||
                  "The KFC burger is a delightful treat! Juicy, perfectly crispy chicken paired with fresh toppings and a soft bun – it's a burst of flavor in every bite. Simple, satisfying, and worth every penny! 🍔✨"}
              </Text>
              <View className="flex-row justify-end pr-4 mt-4">
                <TouchableOpacity onPress={() => router.push('/review-rating')}>
                  <View className="border-2 border-green-500 rounded-full w-10 h-10 items-center justify-center">
                    <Text className="text-green-500 text-2xl">→</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Upcoming Slot */}
        <View className="px-4 mt-3 mb-5">
          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            className="bg-white rounded-lg border border-gray-200 py-3 px-4 mb-2"
          >
            <Text className="text-base text-gray-700">
              Upcoming Slot{selectedSlot ? `: ${selectedSlot}` : ""}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Slot Timing Modal */}
        <Modal
          visible={modalVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}
        >
          <View className="flex-1 justify-center items-center bg-black bg-opacity-40">
            <View className="bg-white rounded-lg p-6 w-80">
              <Text className="text-lg font-bold mb-4">Select a Slot Timing</Text>
              {slotTimingsArray.map((slot, idx) => (
                <TouchableOpacity
                  key={idx}
                  className={`py-2 px-4 rounded mb-2 ${selectedSlot === slot ? "bg-primary-50" : "bg-gray-100"}`}
                  onPress={() => {
                    setSelectedSlot(slot);
                    setModalVisible(false);
                  }}
                >
                  <Text className="text-base text-center">{slot}</Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                className="mt-2 py-2 px-4 rounded bg-primary-50"
                onPress={() => setModalVisible(false)}
              >
                <Text className="text-base text-center text-black">Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Search Bar */}
        <View className="px-4 mb-5">
          <Search placeholder="Search for dishes" />
        </View>

        {/* Filters */}
        <View className="px-4 flex-row mb-2">
          <TouchableOpacity
            className={`rounded-full px-4 py-1 mr-2 ${selectedFilter === 'All' ? 'bg-primary-50' : 'bg-gray-200'}`}
            onPress={() => setSelectedFilter('All')}
          >
            <Text className="text-s">Filters</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`rounded-full px-4 py-1 mr-2 ${selectedFilter === 'Veg' ? 'bg-primary-50' : 'bg-green-100'}`}
            onPress={() => setSelectedFilter('Veg')}
          >
            <Text className={`text-s ${selectedFilter === 'Veg' ? 'text-black' : 'text-green-700'}`}>Veg 🟩</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`rounded-full px-4 py-1 ${selectedFilter === 'Non-Veg' ? 'bg-primary-50' : 'bg-gray-100'}`}
            onPress={() => setSelectedFilter('Non-Veg')}
          >
            <Text className={`text-s ${selectedFilter === 'Non-Veg' ? 'text-black' : 'text-gray-700'}`}>Non-Veg</Text>
          </TouchableOpacity>
        </View>

        {/* Menu Items */}
        <View className="px-4">
          {filteredItems.map((item, index) => {
            const itemId = `${restaurant.title}-${item.name}`;
            const cartItem = cartItems.find((ci: any) => ci.id === itemId);
            return (
              <View
                key={index}
                className="flex-row bg-white rounded-2xl shadow p-4 mb-4 items-center"
              >
                {/* Left: Info */}
                <View className="flex-1 pr-4">
                  <View className="flex-row items-center mb-1">
                    <Text className="text-xl font-bold mr-2">{item.name}</Text>
                    {/* Veg/Non-Veg icon (example: orange square) */}
                    <View className="w-4 h-4 rounded-sm border items-center justify-center ml-1"
                      style={{
                        borderColor: item.type === 'Veg' ? '#22c55e' : '#ef4444', // green-500 or red-500
                        backgroundColor: 'white'
                      }}
                    >
                      <View className="w-2 h-2 rounded-full"
                        style={{
                          backgroundColor: item.type === 'Veg' ? '#22c55e' : '#ef4444' // green-500 or red-500
                        }}
                      />
                    </View>
                  </View>
                  <View className="flex-row items-center mb-1">
                    <Text className="text-lg font-bold mr-2">
                      ₹ {item.price.replace("₹", "")}
                    </Text>
                    <View className="flex-row items-center bg-green-100 rounded px-2 py-0.5 ml-1">
                      <Text className="text-green-700 font-bold text-base">
                        4.2
                      </Text>
                      <Text className="text-green-700 ml-1 text-base">★</Text>
                    </View>
                  </View>
                  <Text className="text-xs text-gray-600 mt-1">
                    serving of spiced rice topped with crispy chicken pieces,
                    often accompanied by a savory gravy or sauce. This dish offers
                    a balanced combination of protein and carbohydrates{" "}
                    <Text className="font-bold text-black">more.....</Text>
                  </Text>
                </View>
                {/* Right: Image and Add/Qty button */}
                <View className="w-32 h-28 relative justify-center items-center">
                  <Image
                    source={item.imageSource}
                    className="w-full h-full rounded-xl"
                    resizeMode="cover"
                  />
                  {cartItem ? (
                    <View className="absolute bottom-2 right-2 flex-row items-center bg-white border border-orange-500 rounded-xl px-2 py-1">
                      <TouchableOpacity
                        onPress={() => {
                          if (cartItem.quantity === 1) {
                            dispatch({
                              type: "cart/removeItem",
                              payload: cartItem.id,
                            });
                          } else {
                            dispatch({
                              type: "cart/updateQuantity",
                              payload: {
                                id: cartItem.id,
                                quantity: cartItem.quantity - 1,
                              },
                            });
                          }
                        }}
                      >
                        <Text className="text-orange-500 font-bold text-xl px-2">
                          -
                        </Text>
                      </TouchableOpacity>
                      <Text className="text-orange-500 font-bold text-base px-2">
                        {cartItem.quantity}
                      </Text>
                      <TouchableOpacity
                        onPress={() =>
                          dispatch({
                            type: "cart/updateQuantity",
                            payload: {
                              id: cartItem.id,
                              quantity: cartItem.quantity + 1,
                            },
                          })
                        }
                      >
                        <Text className="text-orange-500 font-bold text-xl px-2">
                          +
                        </Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <TouchableOpacity
                      className="absolute bottom-2 right-2 border border-orange-500 rounded-xl px-5 py-1 bg-white"
                      onPress={() =>
                        handleAddToCart({
                          ...item,
                          restaurant: restaurant.title,
                          coverPhoto: restaurant.imageSource,
                          address: restaurant.secondSubTitle || "",
                        })
                      }
                    >
                      <Text className="text-orange-500 text-xl font-bold">
                        Add +
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
      {/* Bottom Cart Card */}
      {cartItems.length > 0 && (
        <View className="absolute bottom-5 left-0 right-0 items-center z-50">
          <View className="flex-row bg-white rounded-2xl px-4 py-3 items-center shadow-lg min-w-[320px] justify-between border border-orange-200">
            <View>
              <Text className="font-bold text-sm">
                {cartItems.length} item{cartItems.length > 1 ? "s" : ""} in your cart
              </Text>
              <Text className="text-xs text-gray-700">
                {cartItems[0].quantity}x {cartItems[0].name}
                {cartItems.length > 1 ? "..." : ""}
              </Text>
            </View>
            <TouchableOpacity
              className="bg-orange-500 rounded-lg py-2 px-5 ml-3"
              onPress={() => router.push("/(root)/(tabs)/Cart")}
            >
              <Text className="text-white font-bold text-base">View Cart</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}
