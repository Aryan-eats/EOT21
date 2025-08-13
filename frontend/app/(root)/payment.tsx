import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  SafeAreaView,
  Modal,
  TextInput,
  Alert,
  Dimensions
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSelector, useDispatch } from 'react-redux';
import { clearCart } from '../slices/cartSlice';
import { icons } from '@/constants';

const { width: screenWidth } = Dimensions.get('window');

interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
  type: 'upi' | 'card' | 'wallet' | 'cod';
}

const Payment = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const cartItems = useSelector((state: any) => state.cart.items);
  const [selectedPayment, setSelectedPayment] = useState<string>('upi-paytm');
  const [showUPIModal, setShowUPIModal] = useState(false);
  const [showCardModal, setShowCardModal] = useState(false);
  const [upiId, setUpiId] = useState('');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  });
  const [processing, setProcessing] = useState(false);

  const total = cartItems.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
  const deliveryFee = 29;
  const platformFee = 3;
  const gst = Math.round(total * 0.05);
  const finalTotal = total + deliveryFee + platformFee + gst;

  const paymentMethods: PaymentMethod[] = [
    { id: 'upi-paytm', name: 'Paytm UPI', icon: '📱', type: 'upi' },
    { id: 'upi-gpay', name: 'Google Pay', icon: '🟢', type: 'upi' },
    { id: 'upi-phonepe', name: 'PhonePe', icon: '🟣', type: 'upi' },
    { id: 'upi-other', name: 'Other UPI', icon: '💳', type: 'upi' },
    { id: 'card-credit', name: 'Credit Card', icon: '💳', type: 'card' },
    { id: 'card-debit', name: 'Debit Card', icon: '💳', type: 'card' },
    { id: 'wallet-paytm', name: 'Paytm Wallet', icon: '👛', type: 'wallet' },
    { id: 'cod', name: 'Cash on Delivery', icon: '💵', type: 'cod' },
  ];

  const handlePayment = async () => {
    if (processing) return;

    const method = paymentMethods.find(m => m.id === selectedPayment);
    
    // Validation
    if (method?.type === 'upi' && selectedPayment === 'upi-other' && !upiId.trim()) {
      Alert.alert('Error', 'Please enter a valid UPI ID');
      return;
    }

    if (method?.type === 'card' && (!cardDetails.number || !cardDetails.expiry || !cardDetails.cvv || !cardDetails.name)) {
      Alert.alert('Error', 'Please fill all card details');
      return;
    }

    setProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      setProcessing(false);
      dispatch(clearCart());
      Alert.alert(
        'Payment Successful! 🎉',
        `Your order has been placed successfully using ${method?.name}. You will be redirected to order tracking.`,
        [
          {
            text: 'Track Order',
            onPress: () => router.push('/(root)/order-tracking')
          }
        ]
      );
    }, 2000);
  };

  const formatCardNumber = (text: string) => {
    const cleaned = text.replace(/\s/g, '');
    const match = cleaned.match(/.{1,4}/g);
    return match ? match.join(' ').substring(0, 19) : cleaned;
  };

  const formatExpiry = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return `${cleaned.substring(0, 2)}/${cleaned.substring(2, 4)}`;
    }
    return cleaned;
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Header */}
        <View className="bg-white px-4 py-4 flex-row items-center mt-8">
          <TouchableOpacity onPress={() => router.back()} className="mr-4">
            <Image source={icons.backArrow} className="w-6 h-6" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-gray-900">Payment</Text>
        </View>

        {/* Order Summary */}
        <View className="bg-white mx-4 mt-4 rounded-2xl p-4 shadow-sm">
          <Text className="text-lg font-bold text-gray-900 mb-3">Order Summary</Text>
          <View className="space-y-2">
            <View className="flex-row justify-between">
              <Text className="text-gray-600">Subtotal</Text>
              <Text className="text-gray-900 font-semibold">₹{total}</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-gray-600">Delivery Fee</Text>
              <Text className="text-gray-900 font-semibold">₹{deliveryFee}</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-gray-600">Platform Fee</Text>
              <Text className="text-gray-900 font-semibold">₹{platformFee}</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-gray-600">GST (5%)</Text>
              <Text className="text-gray-900 font-semibold">₹{gst}</Text>
            </View>
            <View className="h-px bg-gray-200 my-2" />
            <View className="flex-row justify-between">
              <Text className="text-lg font-bold text-gray-900">Total</Text>
              <Text className="text-lg font-bold" style={{ color: '#FF6600' }}>₹{finalTotal}</Text>
            </View>
          </View>
        </View>

        {/* Payment Methods */}
        <View className="bg-white mx-4 mt-4 rounded-2xl p-4 shadow-sm">
          <Text className="text-lg font-bold text-gray-900 mb-4">Choose Payment Method</Text>
          
          {/* UPI Section */}
          <View className="mb-4">
            <Text className="text-base font-semibold text-gray-700 mb-2">UPI</Text>
            {paymentMethods.filter(method => method.type === 'upi').map((method) => (
              <TouchableOpacity
                key={method.id}
                className={`flex-row items-center p-3 rounded-xl mb-2 ${
                  selectedPayment === method.id ? 'bg-orange-50 border border-orange-200' : 'bg-gray-50'
                }`}
                onPress={() => {
                  setSelectedPayment(method.id);
                  if (method.id === 'upi-other') {
                    setShowUPIModal(true);
                  }
                }}
              >
                <Text className="text-2xl mr-3">{method.icon}</Text>
                <Text className="text-base text-gray-900 flex-1">{method.name}</Text>
                <View className={`w-5 h-5 rounded-full border-2 ${
                  selectedPayment === method.id ? 'border-orange-500 bg-orange-500' : 'border-gray-300'
                }`}>
                  {selectedPayment === method.id && (
                    <View className="w-2 h-2 bg-white rounded-full m-auto mt-0.5" />
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Cards Section */}
          <View className="mb-4">
            <Text className="text-base font-semibold text-gray-700 mb-2">Cards</Text>
            {paymentMethods.filter(method => method.type === 'card').map((method) => (
              <TouchableOpacity
                key={method.id}
                className={`flex-row items-center p-3 rounded-xl mb-2 ${
                  selectedPayment === method.id ? 'bg-orange-50 border border-orange-200' : 'bg-gray-50'
                }`}
                onPress={() => {
                  setSelectedPayment(method.id);
                  setShowCardModal(true);
                }}
              >
                <Text className="text-2xl mr-3">{method.icon}</Text>
                <Text className="text-base text-gray-900 flex-1">{method.name}</Text>
                <View className={`w-5 h-5 rounded-full border-2 ${
                  selectedPayment === method.id ? 'border-orange-500 bg-orange-500' : 'border-gray-300'
                }`}>
                  {selectedPayment === method.id && (
                    <View className="w-2 h-2 bg-white rounded-full m-auto mt-0.5" />
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Other Methods */}
          <View>
            <Text className="text-base font-semibold text-gray-700 mb-2">Other</Text>
            {paymentMethods.filter(method => method.type === 'wallet' || method.type === 'cod').map((method) => (
              <TouchableOpacity
                key={method.id}
                className={`flex-row items-center p-3 rounded-xl mb-2 ${
                  selectedPayment === method.id ? 'bg-orange-50 border border-orange-200' : 'bg-gray-50'
                }`}
                onPress={() => setSelectedPayment(method.id)}
              >
                <Text className="text-2xl mr-3">{method.icon}</Text>
                <Text className="text-base text-gray-900 flex-1">{method.name}</Text>
                <View className={`w-5 h-5 rounded-full border-2 ${
                  selectedPayment === method.id ? 'border-orange-500 bg-orange-500' : 'border-gray-300'
                }`}>
                  {selectedPayment === method.id && (
                    <View className="w-2 h-2 bg-white rounded-full m-auto mt-0.5" />
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Safety Notice */}
        <View className="bg-green-50 mx-4 mt-4 rounded-xl p-4 flex-row items-center">
          <Text className="text-2xl mr-3">🔒</Text>
          <View className="flex-1">
            <Text className="text-green-700 font-semibold">100% Secure Payments</Text>
            <Text className="text-green-600 text-sm">Your payment information is encrypted and secure</Text>
          </View>
        </View>
      </ScrollView>

      {/* UPI Modal */}
      <Modal
        visible={showUPIModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowUPIModal(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white rounded-2xl p-6 w-80">
            <Text className="text-lg font-bold mb-4">Enter UPI ID</Text>
            <TextInput
              className="border border-gray-300 rounded-xl px-4 py-3 mb-4"
              placeholder="example@upi"
              value={upiId}
              onChangeText={setUpiId}
              autoCapitalize="none"
            />
            <View className="flex-row space-x-3">
              <TouchableOpacity
                className="flex-1 bg-gray-200 rounded-xl py-3"
                onPress={() => setShowUPIModal(false)}
              >
                <Text className="text-center text-gray-700 font-semibold">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1 rounded-xl py-3"
                style={{ backgroundColor: '#FF6600' }}
                onPress={() => setShowUPIModal(false)}
              >
                <Text className="text-center text-white font-semibold">Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Card Modal */}
      <Modal
        visible={showCardModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCardModal(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50 px-4">
          <View className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <Text className="text-lg font-bold mb-4">Enter Card Details</Text>
            
            <TextInput
              className="border border-gray-300 rounded-xl px-4 py-3 mb-3"
              placeholder="Card Number"
              value={cardDetails.number}
              onChangeText={(text) => setCardDetails({...cardDetails, number: formatCardNumber(text)})}
              keyboardType="numeric"
              maxLength={19}
            />
            
            <View className="flex-row space-x-3 mb-3">
              <TextInput
                className="flex-1 border border-gray-300 rounded-xl px-4 py-3"
                placeholder="MM/YY"
                value={cardDetails.expiry}
                onChangeText={(text) => setCardDetails({...cardDetails, expiry: formatExpiry(text)})}
                keyboardType="numeric"
                maxLength={5}
              />
              <TextInput
                className="w-20 border border-gray-300 rounded-xl px-4 py-3"
                placeholder="CVV"
                value={cardDetails.cvv}
                onChangeText={(text) => setCardDetails({...cardDetails, cvv: text.replace(/\D/g, '')})}
                keyboardType="numeric"
                maxLength={3}
                secureTextEntry
              />
            </View>
            
            <TextInput
              className="border border-gray-300 rounded-xl px-4 py-3 mb-4"
              placeholder="Cardholder Name"
              value={cardDetails.name}
              onChangeText={(text) => setCardDetails({...cardDetails, name: text})}
              autoCapitalize="words"
            />
            
            <View className="flex-row space-x-3">
              <TouchableOpacity
                className="flex-1 bg-gray-200 rounded-xl py-3"
                onPress={() => setShowCardModal(false)}
              >
                <Text className="text-center text-gray-700 font-semibold">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1 rounded-xl py-3"
                style={{ backgroundColor: '#FF6600' }}
                onPress={() => setShowCardModal(false)}
              >
                <Text className="text-center text-white font-semibold">Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Bottom Pay Button */}
      <View className="absolute bottom-0 left-0 right-0 bg-white p-4 shadow-lg">
        <TouchableOpacity
          className={`rounded-2xl py-4 ${processing ? 'bg-gray-400' : 'bg-primary-50'}`}
          onPress={handlePayment}
          disabled={processing}
          style={{ backgroundColor: processing ? '#9CA3AF' : '#FF6600' }}
        >
          <Text className="text-center text-white font-bold text-lg">
            {processing ? 'Processing...' : `Pay ₹${finalTotal}`}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Payment;
