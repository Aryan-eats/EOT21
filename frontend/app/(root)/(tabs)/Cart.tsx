import React, { useState, useMemo } from 'react';
import { Text, View, TouchableOpacity, ScrollView, TextInput, Switch, Image, Modal } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { removeItem, updateQuantity, clearCart } from '../../slices/cartSlice';
import { useRouter } from 'expo-router';
import { AllRes } from "../../../constants/AllRes";
import { wp, hp, fs, isTablet } from "@/lib/responsive";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: any;
  restaurant: string;
  coverPhoto?: any;
  address?: string;
}

const Cart = () => {
  const cartItems = useSelector((state: any) => state.cart.items as CartItem[]);
  const dispatch = useDispatch();
  const router = useRouter();
  const [note, setNote] = useState('');
  const [sendNote, setSendNote] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState('');

  const total = useMemo(() => 
    cartItems.reduce((sum: number, item: CartItem) => sum + (item.price * item.quantity), 0),
    [cartItems]
  );
  
  const slotTimingsArray = AllRes[0].slotTimings.split(" , ");

  // Get restaurant info from the first item in the cart
  const restaurantName = cartItems[0]?.restaurant || '';
  let restaurantAddress = cartItems[0]?.address || '';
  if (!restaurantAddress && restaurantName === 'Restaurant 1') {
    restaurantAddress = 'S3-910, 9th Floor, Sun 3, Migsun Ultimo';
  }
  // Get restaurant info from AllRes
  const restaurantInfo = AllRes.find(res => res.title === restaurantName);
  const deliveryTime = restaurantInfo?.deliveryTime || '35-40 mins';

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView 
        contentContainerStyle={{ paddingBottom: hp(15) }} 
        className="px-4"
        showsVerticalScrollIndicator={false}
      >
        {/* Restaurant Name and Address */}
        {cartItems.length > 0 && (
          <View className="mb-6" style={{ marginTop: hp(8) }}>
            <Text 
              className="font-extrabold text-gray-800 mb-2 mt-2" 
              style={{ fontSize: fs(24) }}
            >
              {restaurantName}
            </Text>
            <Text 
              className="text-gray-500 mb-2" 
              style={{ fontSize: fs(16) }}
            >
              {restaurantAddress}
            </Text>
          </View>
        )}

        {/* Cart Items */}
        {cartItems.length === 0 ? (
          <View className="flex-1 items-center justify-center" style={{ marginTop: hp(10) }}>
            <Text className="text-gray-400" style={{ fontSize: fs(18) }}>Your cart is empty</Text>
          </View>
        ) : (
          cartItems.map((item) => (
            <View key={item.id} className="bg-white rounded-2xl p-4 mb-3 shadow-sm flex-row items-center">
              <Image 
                source={typeof item.image === 'string' ? { uri: item.image } : item.image} 
                className="rounded-xl mr-3" 
                style={{ 
                  width: isTablet() ? wp(12) : wp(16), 
                  height: isTablet() ? wp(12) : wp(16) 
                }}
              />
              <View className="flex-1">
                <Text 
                  className="font-semibold text-gray-900" 
                  style={{ fontSize: fs(16) }}
                >
                  {item.name}
                </Text>
                <Text 
                  className="text-gray-900 font-bold mt-1" 
                  style={{ fontSize: fs(16) }}
                >
                  ₹{item.price * item.quantity}
                </Text>
                <View className="flex-row items-center mt-2">
                  <TouchableOpacity 
                    onPress={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity - 1 }))} 
                    className="px-2"
                  >
                    <Text 
                      style={{ color: '#FF6600', fontSize: fs(18) }} 
                      className="font-bold"
                    >
                      -
                    </Text>
                  </TouchableOpacity>
                  <Text 
                    className="mx-2 text-gray-900" 
                    style={{ fontSize: fs(16) }}
                  >
                    {item.quantity}
                  </Text>
                  <TouchableOpacity 
                    onPress={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))} 
                    className="px-2"
                  >
                    <Text 
                      style={{ color: '#FF6600', fontSize: fs(18) }} 
                      className="font-bold"
                    >
                      +
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    onPress={() => dispatch(removeItem(item.id))} 
                    className="ml-4 px-2"
                  >
                    <Text className="text-red-500" style={{ fontSize: fs(12) }}>Remove</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))
        )}

        {/* Add more items */}
        {cartItems.length > 0 && (
          <TouchableOpacity 
            className="self-start bg-orange-50 rounded-full px-4 py-1.5 mb-4"
            onPress={() => router.push({
              pathname: "/restaurant",
              params: { title: restaurantName }
            })}
          >
            <Text 
              style={{ color: '#FF6600', fontSize: fs(16) }} 
              className="font-semibold"
            >
              + Add more items
            </Text>
          </TouchableOpacity>
        )}

        {/* Apply Coupon Section */}
        {cartItems.length > 0 && (
          <TouchableOpacity 
            className="bg-white rounded-xl p-4 mb-4 flex-row items-center"
            onPress={() => router.push("/coupons")}
          >
            <Text 
              className="text-gray-900 font-semibold" 
              style={{ fontSize: fs(16) }}
            >
              View all coupons
            </Text>
          </TouchableOpacity>
        )}

        {/* Note for restaurant */}
        {cartItems.length > 0 && (
          <View className="bg-white rounded-xl p-3 mb-4">
            <TextInput
              className="border border-gray-100 rounded-md px-2 py-2 text-gray-900 bg-gray-50"
              style={{ fontSize: fs(14) }}
              placeholder="Add a note for the restaurant"
              value={note}
              onChangeText={setNote}
              editable={sendNote}
              placeholderTextColor="#aaa"
            />
            <View className="flex-row items-center mt-2">
              <Switch
                value={sendNote}
                onValueChange={setSendNote}
                trackColor={{ false: '#ccc', true: '#FF6600' }}
                thumbColor={sendNote ? '#FF6600' : '#f4f3f4'}
              />
              <Text className="ml-2 text-gray-400" style={{ fontSize: fs(14) }}>
                {sendNote ? 'Send note' : "Don't send"}
              </Text>
            </View>
          </View>
        )}

        {/* Delivery Details Section */}
        {cartItems.length > 0 && (
          <View className="bg-white rounded-xl p-4 mb-4">
            <Text className="text-gray-900 mb-1" style={{ fontSize: fs(16) }}>
              {selectedSlot ? (
                <>Delivery at <Text className="font-bold">{selectedSlot}</Text></>
              ) : (
                <>Delivery in <Text className="font-bold">{deliveryTime}</Text></>
              )}
            </Text>
            <Text className="text-gray-400 mb-2" style={{ fontSize: fs(12) }}>
              Want this later?{" "}
              <TouchableOpacity onPress={() => setModalVisible(true)} className="inline">
                <Text className="text-orange-500 font-JakartaBold" style={{ fontSize: fs(12) }}>Schedule it</Text>
              </TouchableOpacity>
            </Text>
            {selectedSlot && (
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-gray-600" style={{ fontSize: fs(14) }}>Scheduled for: {selectedSlot}</Text>
                <TouchableOpacity 
                  onPress={() => setSelectedSlot('')}
                  className="bg-orange-50 px-3 py-1 rounded-full"
                >
                  <Text className="text-orange-500 font-semibold" style={{ fontSize: fs(12) }}>Remove Schedule</Text>
                </TouchableOpacity>
              </View>
            )}
            <View className="h-px bg-gray-100 my-2" />
            <Text className="text-gray-900 mb-1" style={{ fontSize: fs(16) }}>
              Delivery at <Text className="font-bold">Home</Text>
            </Text>
            <Text className="text-gray-400" style={{ fontSize: fs(12) }}>S3-910, 9th Floor, Sun 3, Migsun Ultimo</Text>
            <Text style={{ color: '#FF6600', fontSize: fs(12) }}>Add instructions for delivery partner</Text>
            <View className="h-px bg-gray-100 my-2" />
            <Text className="text-gray-900 mt-1" style={{ fontSize: fs(14) }}>
              Rishabh, <Text style={{ color: '#FF6600' }} className="font-bold">+91-8826366530</Text>
            </Text>
          </View>
        )}

        {/* Bill Summary */}
        {cartItems.length > 0 && (
          <View className="bg-white rounded-xl p-4 mb-4 items-start">
            <Text className="text-gray-900 font-semibold" style={{ fontSize: fs(16) }}>Total Bill</Text>
            <Text style={{ color: '#FF6600', fontSize: fs(18) }} className="font-bold mt-1">₹{total.toFixed(2)}</Text>
            <Text className="text-gray-400 mt-1" style={{ fontSize: fs(12) }}>Incl. taxes and charges</Text>
          </View>
        )}

        {/* Payment Method */}
        {cartItems.length > 0 && (
          <TouchableOpacity 
            className="bg-white rounded-xl p-4 mb-6"
            onPress={() => router.push('/(root)/payment')}
            activeOpacity={0.7}
          >
            <Text className="text-gray-400 mb-1" style={{ fontSize: fs(14) }}>Pay using</Text>
            <View className="flex-row items-center justify-between">
              <Text className="text-gray-900 font-semibold" style={{ fontSize: fs(16) }}>Paytm UPI</Text>
              <Text style={{ color: '#FF6600', fontSize: fs(12) }} className="font-semibold">Change</Text>
            </View>
          </TouchableOpacity>
        )}
      </ScrollView>

      {/* Slot Timing Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black bg-opacity-40">
          <View 
            className="bg-white rounded-lg p-6" 
            style={{ width: isTablet() ? wp(60) : wp(80) }}
          >
            <Text className="font-bold mb-4" style={{ fontSize: fs(18) }}>Select a Slot Timing</Text>
            {slotTimingsArray.map((slot, idx) => (
              <TouchableOpacity
                key={idx}
                className={`py-2 px-4 rounded mb-2 ${selectedSlot === slot ? "bg-orange-50" : "bg-gray-100"}`}
                onPress={() => {
                  setSelectedSlot(slot);
                  setModalVisible(false);
                }}
              >
                <Text className="text-center" style={{ fontSize: fs(16) }}>{slot}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              className="mt-2 py-2 px-4 rounded bg-gray-100"
              onPress={() => setModalVisible(false)}
            >
              <Text className="text-center text-gray-900" style={{ fontSize: fs(16) }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Sticky Bottom Bar */}
      {/* {cartItems.length > 0 && (
        <View className="absolute left-0 right-0 bottom-0 bg-white flex-row items-center justify-between px-5 py-4 rounded-t-2xl shadow-lg">
          <Text className="text-gray-900 font-bold" style={{ fontSize: fs(18) }}>₹{total.toFixed(2)} TOTAL</Text>
          <TouchableOpacity 
            style={{ backgroundColor: '#FF6600' }} 
            className="rounded-full px-7 py-3 ml-2"
            onPress={() => router.push('/(root)/payment')}
          >
            <Text className="text-white font-bold" style={{ fontSize: fs(16) }}>Place Order</Text>
          </TouchableOpacity>
        </View>
      )} */}
    </View>
  );
};

export default Cart;