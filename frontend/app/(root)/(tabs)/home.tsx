import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity, Alert, FlatList } from "react-native";
import React, { useState, useMemo, useCallback } from "react";
import { images } from "@/constants/images";
import Search from "@/components/Search";
import HeadingWithSeparator from "@/components/HeadingWithSeparator";
import ItemCard from "@/components/ItemCard";
import { ResData } from "@/constants/ResData";
import { RestDish } from "@/constants/RestDishes";
import { useDispatch, useSelector } from 'react-redux';
import { addItem, updateQuantity, removeItem } from '../../slices/cartSlice';
import { useRouter } from "expo-router";
import { wp, hp, fs, isTablet } from "@/lib/responsive";

const App = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<'recommended' | 'wishlist'>('recommended');
  const [wishlist, setWishlist] = useState<string[]>([]); // Store wishlisted item titles
  
  const dispatch = useDispatch();
  const cartItems = useSelector((state: any) => state.cart.items);

  // Memoized filtered data
  const filteredResData = useMemo(() => {
    return ResData.filter((item) => {
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTab = activeTab === 'recommended' || wishlist.includes(item.title);
      return matchesSearch && matchesTab;
    });
  }, [searchQuery, activeTab, wishlist]);

  // Toggle wishlist status
  const handleToggleWishlist = useCallback((title: string) => {
    setWishlist((prev) =>
      prev.includes(title)
        ? prev.filter((t) => t !== title)
        : [...prev, title]
    );
  }, []);

  // Add to cart handler for restaurant items
  const handleAddToCart = useCallback((
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
  }, [cartItems, dispatch]);

  const handleRestaurantPress = useCallback((restaurant: any) => {
    router.push({
      pathname: "/restaurant",
      params: { title: restaurant.title }
    });
  }, [router]);

  // Render restaurant card
  const renderRestaurantCard = useCallback(({ item, index }: { item: any, index: number }) => (
    <ItemCard
      key={item.title}
      {...item}
      isWishListButton={true}
      isWishlisted={wishlist.includes(item.title)}
      whishListButtonOnPress={() => handleToggleWishlist(item.title)}
      onPress={() => handleRestaurantPress(item)}
    />
  ), [wishlist, handleToggleWishlist, handleRestaurantPress]);

  // Render dish card
  const renderDishCard = useCallback(({ item, index }: { item: any, index: number }) => (
    <ItemCard key={index} {...item} />
  ), []);

  return (
    <View className="w-full h-full">
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          alignItems: "center",
          backgroundColor: "white",
          paddingBottom: 100,
        }}
        showsVerticalScrollIndicator={false}
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
          <View className="w-full flex flex-col" style={{ marginTop: hp(5) }}>
            {/* Header */}
            <View className="px-5 mb-1" style={{ marginTop: hp(3) }}>
              <Text 
                className="font-bold text-[#222]" 
                style={{ fontSize: fs(16) }}
              >
                Bennett University <Text style={{ fontSize: fs(12) }}>▼</Text>
              </Text>
              <Text 
                className="text-[#444] mt-1" 
                style={{ fontSize: fs(14) }}
              >
                TechZone 2 , Uttar Pradesh ,201310
              </Text>
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
          <View 
            className="w-full items-center mt-2 mb-2 relative"
            style={{ minHeight: hp(15) }}
          >
            {/* Salad image (left) */}
            <Image 
              source={images.home} 
              className="absolute left-[-30px] rounded-xl" 
              style={{
                top: hp(4), 
                width: wp(28), 
                height: hp(10),
                resizeMode: 'contain', 
                opacity: 0.95
              }} 
            />
            {/* Pizza image (right) */}
            <Image 
              source={images.home} 
              className="absolute right-[-30px] rounded-xl" 
              style={{
                top: hp(4), 
                width: wp(25), 
                height: hp(10),
                resizeMode: 'contain', 
                opacity: 0.95
              }} 
            />
            
            <Text 
              className="text-[#FF7A00] tracking-wider mb-1" 
              style={{
                fontSize: fs(32), 
                fontWeight: 'bold',
                marginTop: hp(1.5),
                textShadowColor: '#fff', 
                textShadowOffset: {width: 1, height: 1}, 
                textShadowRadius: 2
              }}
            >
              SAVE MORE
            </Text>
            <Text 
              className="text-[#C97A00] font-semibold text-center mb-0.5" 
              style={{ fontSize: fs(18) }}
            >
              The "big red app" loves fees
            </Text>
            <Text 
              className="text-[#C97A00] font-semibold text-center mb-2" 
              style={{ fontSize: fs(18) }}
            >
              But we love "Big Savings"
            </Text>
          </View>
          
          {/* Trending Offers Section */}
          <View className="w-full items-center mb-2">
            <View className="flex-row items-center mb-2 justify-center">
              <View className="flex-1 h-[1px] bg-[#FF7A00] mr-2 ml-6" />
              <Text 
                className="text-[#FF7A00] font-bold bg-[#FFE5D0] px-2 rounded border border-[#FF7A00]" 
                style={{ fontSize: fs(16) }}
              >
                Trending offers for you
              </Text>
              <View className="flex-1 h-[1px] bg-[#FF7A00] ml-2 mr-6" />
            </View>
            <View className="flex-row justify-between w-[90%]">
              {[0,1,2].map((_, idx) => (
                <View 
                  key={idx} 
                  className="border-2 border-[#FF7A00] rounded-xl bg-white mx-1" 
                  style={{
                    width: wp(22), 
                    height: wp(22),
                    shadowColor: '#FF7A00', 
                    shadowOpacity: 0.08, 
                    shadowRadius: 4, 
                    shadowOffset: {width: 0, height: 2}
                  }} 
                />
              ))}
            </View>
          </View>
        </View>

        {/* For You */}
        <View className="w-full flex items-center justify-center" style={{ height: hp(8) }}>
          <HeadingWithSeparator text="For You" />
        </View>

        {/* Recommended/Wishlist Block */}
        <View className="w-full flex items-center justify-center mt-1">
          {/* Tab Bar */}
          <View className="flex-row bg-[#FFF3E0] rounded-xl p-1 mb-2 w-11/12 justify-center">
            <TouchableOpacity
              className={`flex-1 items-center rounded-lg ${activeTab === 'recommended' ? 'bg-[#FF7A00]' : 'bg-transparent'}`}
              style={{ paddingVertical: hp(0.8) }}
              onPress={() => setActiveTab('recommended')}
            >
              <Text 
                className={`font-bold ${activeTab === 'recommended' ? 'text-white' : 'text-[#FF7A00]'}`}
                style={{ fontSize: fs(14) }}
              >
                Recommended
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`flex-1 items-center rounded-lg ${activeTab === 'wishlist' ? 'bg-[#FF7A00]' : 'bg-transparent'}`}
              style={{ paddingVertical: hp(0.8) }}
              onPress={() => setActiveTab('wishlist')}
            >
              <Text 
                className={`font-bold ${activeTab === 'wishlist' ? 'text-white' : 'text-[#FF7A00]'}`}
                style={{ fontSize: fs(14) }}
              >
                Wishlist
              </Text>
            </TouchableOpacity>
          </View>
          
          {/* Cards Grid - Optimized with FlatList */}
          <View className="w-full flex justify-center items-center">
            <FlatList
              data={filteredResData}
              renderItem={renderRestaurantCard}
              keyExtractor={(item) => item.title}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                paddingHorizontal: wp(2),
                gap: wp(3),
                minHeight: hp(25),
              }}
              ItemSeparatorComponent={() => <View style={{ width: wp(2) }} />}
              getItemLayout={(data, index) => ({
                length: isTablet() ? wp(25) : wp(42),
                offset: (isTablet() ? wp(25) : wp(42)) * index,
                index,
              })}
            />
          </View>
        </View>

        {/* What's On Your Mind? */}
        <View className="w-full flex items-center justify-center" style={{ height: hp(10) }}>
          <HeadingWithSeparator text="What's On Your Mind?" />
        </View>
        
        <View style={{ height: hp(25) }}>
          <FlatList
            data={RestDish}
            renderItem={renderDishCard}
            keyExtractor={(item, index) => `${item.title}-${index}`}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: wp(4),
              gap: wp(3),
            }}
            ItemSeparatorComponent={() => <View style={{ width: wp(2) }} />}
          />
        </View>

        {/* Trending Restaurants */}
        <View className="w-full flex items-center justify-center" style={{ height: hp(10) }}>
          <HeadingWithSeparator text="Trending Restaurants" />
        </View>

        {/* Dynamic Restaurant Cards */}
        {ResData.slice(0, 3).map((restaurant, idx) => (
          <View 
            key={restaurant.title} 
            className="bg-white rounded-xl shadow-black shadow-md pb-8 mb-8 mx-auto mt-2 relative"
            style={{ width: wp(90), minHeight: hp(35) }}
          >
            {/* Restaurant Image */}
            <Image
              source={restaurant.imageSource}
              className="w-full bg-gray-200 border rounded-xl"
              style={{ height: hp(25) }}
              resizeMode="cover"
            />

            {/* Popular Items Heading */}
            <View className="w-full flex items-center justify-center overflow-hidden mt-2" style={{ height: hp(8) }}>
              <Text className="text-gray-900 font-bold" style={{ fontSize: fs(18) }}>Popular items</Text>
            </View>

            {/* Popular Items Scroll */}
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: wp(2.5), gap: wp(2.5) }}
            >
              <View className="flex flex-row" style={{ gap: wp(4) }}>
                {restaurant.items.map((item, itemIdx) => {
                  const itemId = `${restaurant.title}-${item.name}`;
                  const cartItem = cartItems.find((ci: any) => ci.id === itemId);
                  return (
                    <View 
                      key={item.name} 
                      className="bg-white rounded-xl shadow border mx-1 p-2"
                      style={{ width: wp(35) }}
                    >
                      <Image 
                        source={item.imageSource} 
                        className="w-full rounded-lg" 
                        style={{ height: hp(12) }}
                        resizeMode="cover" 
                      />
                      <Text 
                        className="font-semibold mt-2" 
                        style={{ fontSize: fs(14) }}
                      >
                        {item.name}
                      </Text>
                      <Text 
                        className="text-orange-600 font-extrabold mt-1" 
                        style={{ fontSize: fs(18) }}
                      >
                        {item.price}
                      </Text>
                      {cartItem ? (
                        <View className="flex-row items-center mt-2 self-end bg-white border border-orange-400 rounded-md px-2 py-1">
                          <TouchableOpacity onPress={() => {
                            if (cartItem.quantity === 1) {
                              dispatch(removeItem(cartItem.id));
                            } else {
                              dispatch(updateQuantity({ id: cartItem.id, quantity: cartItem.quantity - 1 }));
                            }
                          }}>
                            <Text className="text-orange-500 font-bold px-2" style={{ fontSize: fs(16) }}>-</Text>
                          </TouchableOpacity>
                          <Text className="text-orange-500 font-bold px-2" style={{ fontSize: fs(14) }}>{cartItem.quantity}</Text>
                          <TouchableOpacity onPress={() => dispatch(updateQuantity({ id: cartItem.id, quantity: cartItem.quantity + 1 }))}>
                            <Text className="text-orange-500 font-bold px-2" style={{ fontSize: fs(16) }}>+</Text>
                          </TouchableOpacity>
                        </View>
                      ) : (
                        <TouchableOpacity
                          className="mt-2 bg-white border border-orange-400 rounded-md px-3 py-1 self-end"
                          onPress={() => handleAddToCart(restaurant, item)}
                        >
                          <Text className="text-orange-500 font-bold" style={{ fontSize: fs(14) }}>Add +</Text>
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
              <Text className="text-gray-900 font-bold" style={{ fontSize: fs(20) }}>{restaurant.title}</Text>
              <Text className="text-gray-500" style={{ fontSize: fs(14) }}>
                {(restaurant as any).priceForOne ? `$${(restaurant as any).priceForOne} for one` : '$200 for one'}
              </Text>
              <View className="flex-row items-center mt-1">
                <View className="bg-green-500 rounded px-2 py-0.5 mr-2">
                  <Text className="text-white font-bold" style={{ fontSize: fs(14) }}>
                    {(restaurant as any).rating ? `${(restaurant as any).rating} ★` : '4.7 ★'}
                  </Text>
                </View>
              </View>
            </View>
            {/* Offer text above Browse Menu button */}
            <Text 
              className="text-orange-500 font-bold absolute right-4"
              style={{ 
                fontSize: fs(14),
                bottom: hp(10)
              }}
            >
              {(restaurant as any).offer ? (restaurant as any).offer : '75 % off up to $10'}
            </Text>
            {/* Browse Menu Button - bottom right */}
            <TouchableOpacity
              className="bg-orange-500 rounded-lg px-6 py-3 absolute right-4"
              style={{ bottom: hp(2) }}
              onPress={() => handleRestaurantPress(restaurant)}
            >
              <Text className="text-white font-bold" style={{ fontSize: fs(16) }}>Browse Menu</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default App;
