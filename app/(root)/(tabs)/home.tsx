import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity, Alert } from "react-native";
import React, { useState } from "react";
import { images } from "@/constants/images";
import Search from "@/components/Search";
import HeadingWithSeparator from "@/components/HeadingWithSeparator";
import ItemCard from "@/components/ItemCard";
import { ResData } from "@/constants/ResData";
import { RestDish } from "@/constants/RestDishes";
import { useDispatch, useSelector } from 'react-redux';
import { addItem, updateQuantity, removeItem } from '../../slices/cartSlice';
import { useRouter } from "expo-router";

const App = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<'recommended' | 'wishlist'>('recommended');
  const [wishlist, setWishlist] = useState<string[]>([]); // Store wishlisted item titles
  const offers = new Array(3).fill(null);
  
  const dispatch = useDispatch();
  const cartItems = useSelector((state: any) => state.cart.items);

  // Toggle wishlist status
  const handleToggleWishlist = (title: string) => {
    setWishlist((prev) =>
      prev.includes(title)
        ? prev.filter((t) => t !== title)
        : [...prev, title]
    );
  };

  // Filter data based on search query and active tab
  const filteredResData = ResData.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'recommended' || wishlist.includes(item.title);
    return matchesSearch && matchesTab;
  });
  
  // Add to cart handler for restaurant items
  const handleAddToCart = (
    restaurant: {
      title: string;
      imageSource: any;
      secondSubTitle?: string;
    },
    item: {
      name: string;
      price: string;
      imageSource: any;
    }
  ) => {
    // Single restaurant cart logic
    if (cartItems.length > 0) {
      const cartRestaurant = cartItems[0].restaurant;
      if (cartRestaurant !== restaurant.title) {
        Alert.alert("Multiple restaurant isn't available right now");
        return;
      }
    }
    dispatch(addItem({
      id: `${restaurant.title}-${item.name}`,
      name: item.name,
      price: parseInt(item.price),
      image: item.imageSource,
      restaurant: restaurant.title,
      coverPhoto: restaurant.imageSource,
      address: restaurant.secondSubTitle || '',
    }));
  };

  const handleRestaurantPress = (restaurant: any) => {
    router.push({
      pathname: "/restaurant",
      params: { title: restaurant.title }
    });
  };

  return (
  
  <View className={`w-full h-full`}>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          alignItems: "center",
          backgroundColor: "white",
          paddingBottom: 100,
        }}
      >
        {/* Top Section */}
        <View className="w-full bg-[#FFE5D0] rounded-b-2xl pb-6 mb-2 overflow-hidden relative">
          {/* Background image */}
          <Image
            source={images.home}
            className="absolute w-full h-full top-0 left-0"
            style={{resizeMode: 'cover', opacity: 0.18}}
          />
          {/* Header and Search Bar Group */}
          <View className="w-full flex flex-col mt-10">
            {/* Header */}
            <View className="px-5 mb-1 mt-6">
              <Text className="font-bold text-[16px] text-[#222]">Bennett University <Text className="text-[12px]">▼</Text></Text>
              <Text className="text-[#444] text-[14px] mt-1">TechZone 2 , Uttar Pradesh ,201310</Text>
            </View>
            {/* Search Bar */}
            <View className="mx-4 mt-2 mb-4">
              <Search 
                placeholder="Search for restaurants and food"
                value={searchQuery}
                onChangeText={setSearchQuery}
                onPress={() => {}}
              />
            </View>
          </View>
          {/* Save More Section */}
          <View className="w-full items-center mt-2 mb-2 relative min-h-[120px]">
            {/* Salad image (left) */}
            <Image source={images.home} className="absolute left-[-30px] top-[30px] w-[110px] h-[80px] rounded-xl" style={{resizeMode: 'contain', opacity: 0.95}} />
            {/* Pizza image (right) */}
            <Image source={images.home} className="absolute right-[-30px] top-[30px] w-[100px] h-[80px] rounded-xl" style={{resizeMode: 'contain', opacity: 0.95}} />
            <Text className="text-[32px] font-bold text-[#FF7A00] tracking-wider mb-1 mt-3" style={{textShadowColor: '#fff', textShadowOffset: {width: 1, height: 1}, textShadowRadius: 2}}>SAVE MORE</Text>
            <Text className="text-[18px] text-[#C97A00] font-semibold text-center mb-0.5">The "big red app" loves fees</Text>
            <Text className="text-[18px] text-[#C97A00] font-semibold text-center mb-2">But we love "Big Savings"</Text>
          </View>
          {/* Trending Offers Section */}
          <View className="w-full items-center mb-2">
            <View className="flex-row items-center mb-2 justify-center">
              <View className="flex-1 h-[1px] bg-[#FF7A00] mr-2 ml-6" />
              <Text className="text-[#FF7A00] font-bold text-[16px] bg-[#FFE5D0] px-2 rounded border border-[#FF7A00]">Trending offers for you</Text>
              <View className="flex-1 h-[1px] bg-[#FF7A00] ml-2 mr-6" />
            </View>
            <View className="flex-row justify-between w-[90%]">
              {[0,1,2].map((_, idx) => (
                <View key={idx} className="w-[90px] h-[90px] border-2 border-[#FF7A00] rounded-xl bg-white mx-1" style={{shadowColor: '#FF7A00', shadowOpacity: 0.08, shadowRadius: 4, shadowOffset: {width: 0, height: 2}}} />
              ))}
            </View>
          </View>
        </View>

        {/* For You */}
        <View className={`w-full h-16 flex items-center justify-center`}>
          <HeadingWithSeparator text="For You" />
        </View>

        {/* Recommended/Wishlist Block */}
        <View className="w-full flex items-center justify-center mt-1 ">
          {/* Tab Bar */}
          <View className="flex-row bg-[#FFF3E0] rounded-xl p-1 mb-2 w-11/12 justify-center">
            <TouchableOpacity
              className={`flex-1 items-center py-1.5 rounded-lg ${activeTab === 'recommended' ? 'bg-[#FF7A00]' : 'bg-transparent'}`}
              onPress={() => setActiveTab('recommended')}
            >
              <Text className={`font-bold ${activeTab === 'recommended' ? 'text-white' : 'text-[#FF7A00]'}`}>Recommended</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`flex-1 items-center py-1.5 rounded-lg ${activeTab === 'wishlist' ? 'bg-[#FF7A00]' : 'bg-transparent'}`}
              onPress={() => setActiveTab('wishlist')}
            >
              <Text className={`font-bold ${activeTab === 'wishlist' ? 'text-white' : 'text-[#FF7A00]'}`}>Wishlist</Text>
            </TouchableOpacity>
          </View>
          {/* Cards 2-row layout */}
          <View className="w-full flex justify-center items-center">
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                paddingHorizontal: 6,
                gap: 8,
                minHeight: 180,
              }}
            >
              <View className="flex flex-col gap-3">
                {Array.from({ length: 2 }).map((_, rowIndex) => (
                  <View key={rowIndex} className="flex flex-row gap-3">
                    {filteredResData.filter((_, i) => i % 2 === rowIndex).map(
                      (item, index) => (
                        <ItemCard
                          key={item.title || index}
                          {...item}
                          isWishListButton={true}
                          isWishlisted={wishlist.includes(item.title)}
                          whishListButtonOnPress={() => handleToggleWishlist(item.title)}
                          onPress={() => handleRestaurantPress(item)}
                        />
                      )
                    )}
                  </View>
                ))}
              </View>
            </ScrollView>
          </View>
        </View>

        {/* Whats On Your Mind? */}
        <View className="w-full h-20 flex items-center justify-center">
          <HeadingWithSeparator text="Whats On Your Mind?" />
        </View>
        <ScrollView
          horizontal={true} // Enable left-right scrolling
          showsHorizontalScrollIndicator={false} // Hide scrollbar
          contentContainerStyle={{
            paddingHorizontal: 10, // Add padding
            gap: 10, // Space between columns
          }}
        >
          <View className="flex flex-col gap-4">
            {Array.from({ length: 2 }).map((_, rowIndex) => (
              <View key={rowIndex} className="flex flex-row gap-4">
                {RestDish.filter((_, i) => i % 2 === rowIndex).map(
                  (item, index) => (
                    <ItemCard key={index} {...item} />
                  )
                )}
              </View>
            ))}
          </View>
        </ScrollView>

        {/* Trending Restaurants */}
        <View className="w-full h-20 flex items-center justify-center">
          <HeadingWithSeparator text="Trending Restaurants" />
        </View>

        {/* Dynamic Restaurant Cards */}
        {ResData.slice(0, 3).map((restaurant, idx) => (
          <View key={restaurant.title} className="w-11/12 min-h-60 bg-white rounded-xl shadow-black shadow-md pb-8 mb-8 mx-auto mt-2 relative">
            {/* Restaurant Image */}
            <Image
              source={restaurant.imageSource}
              className="w-full h-60 bg-gray-200 border rounded-xl"
              resizeMode="cover"
            />

            {/* Popular Items Heading */}
            <View className="w-full h-16 flex items-center justify-center overflow-hidden mt-2">
              <Text className="text-lg font-bold text-gray-900">Popular items</Text>
            </View>

            {/* Popular Items Scroll */}
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 10, gap: 10 }}
            >
              <View className="flex flex-row gap-4">
                {restaurant.items.map((item, itemIdx) => {
                  const itemId = `${restaurant.title}-${item.name}`;
                  const cartItem = cartItems.find((ci: any) => ci.id === itemId);
                  return (
                    <View key={item.name} className="w-40 bg-white rounded-xl shadow border mx-1 p-2">
                      <Image source={item.imageSource} className="w-full h-24 rounded-lg" resizeMode="cover" />
                      <Text className="font-semibold text-base mt-2">{item.name}</Text>
                      <Text className="text-orange-600 font-extrabold text-xl mt-1">{item.price}</Text>
                      {cartItem ? (
                        <View className="flex-row items-center mt-2 self-end bg-white border border-orange-400 rounded-md px-2 py-1">
                          <TouchableOpacity onPress={() => {
                            if (cartItem.quantity === 1) {
                              dispatch(removeItem(cartItem.id));
                            } else {
                              dispatch(updateQuantity({ id: cartItem.id, quantity: cartItem.quantity - 1 }));
                            }
                          }}>
                            <Text className="text-orange-500 font-bold text-lg px-2">-</Text>
                          </TouchableOpacity>
                          <Text className="text-orange-500 font-bold text-base px-2">{cartItem.quantity}</Text>
                          <TouchableOpacity onPress={() => dispatch(updateQuantity({ id: cartItem.id, quantity: cartItem.quantity + 1 }))}>
                            <Text className="text-orange-500 font-bold text-lg px-2">+</Text>
                          </TouchableOpacity>
                        </View>
                      ) : (
                        <TouchableOpacity
                          className="mt-2 bg-white border border-orange-400 rounded-md px-3 py-1 self-end"
                          onPress={() => handleAddToCart(restaurant, item)}
                        >
                          <Text className="text-orange-500 font-bold text-base">Add +</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  );
                })}
              </View>
            </ScrollView>

            {/* Thin border between popular items and restaurant info */}
            <View className="h-px bg-gray-600 my-4 w-full" />

            {/* Restaurant Info */}
            <View className="px-4">
              <Text className="text-2xl font-bold text-gray-900">{restaurant.title}</Text>
              <Text className="text-base text-gray-500">{(restaurant as any).priceForOne ? `$${(restaurant as any).priceForOne} for one` : '$200 for one'}</Text>
              <View className="flex-row items-center mt-1">
                <View className="bg-green-500 rounded px-2 py-0.5 mr-2">
                  <Text className="text-white font-bold text-base">{(restaurant as any).rating ? `${(restaurant as any).rating} ★` : '4.7 ★'}</Text>
                </View>
              </View>
            </View>
            {/* Offer text above Browse Menu button */}
            <Text className="text-orange-500 font-bold text-base absolute right-4 bottom-20">{(restaurant as any).offer ? (restaurant as any).offer : '75 % off up to $10'}</Text>
            {/* Browse Menu Button - bottom right */}
            <TouchableOpacity
              className="bg-orange-500 rounded-lg px-6 py-3 absolute right-4 bottom-4"
              onPress={() => handleRestaurantPress(restaurant)}
            >
              <Text className="text-white font-bold text-lg">Browse Menu</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  specialText: {
    fontSize: 35,
    fontWeight: "bold",
    color: "transparent",
    textShadowColor: "black",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});

export default App;
