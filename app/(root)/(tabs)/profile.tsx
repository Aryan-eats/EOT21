import { Text, View, Switch, TouchableOpacity, ScrollView, Image, Animated, Easing } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import InputFeild from "@/components/InputFeild";
import CustomButton from "@/components/CustomButton";
import { icons } from "@/constants/icons";
import { useEffect, useRef, useState } from "react";
import { LinearGradient } from 'expo-linear-gradient';

export default function Profile() {
  const [appearance, setAppearance] = useState('light');
  const [isGold, setIsGold] = useState(true);
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [dob, setDob] = useState('');

  // Animation for gold badge
  const pulseAnim = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.15,
          duration: 900,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
      ])
    ).start();
  }, [pulseAnim]);

  // Fade-in animation for the whole page
  const fadeAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 700,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-black">
      <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
        <ScrollView contentContainerStyle={{ paddingBottom: 96 }}>
          {/* Profile Header with Gradient */}
          <LinearGradient
            colors={["#1A0A02", "#3B2412", "#1A0A02"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="w-full rounded-b-2xl pb-6 mb-4 overflow-hidden items-center pt-8 shadow-lg"
            style={{ minHeight: 220, elevation: 8 }}
          >
            <View className="items-center justify-center mb-2">
              <View className="w-24 h-24 rounded-full bg-[#2D1608] items-center justify-center mb-2 border-4 border-[#4B2E1A] shadow-lg" style={{ elevation: 8 }}>
                <Image source={icons.profile} className="w-20 h-20 rounded-full" resizeMode="contain" />
              </View>
              <Text className="text-2xl font-bold text-white">Rishabh</Text>
              <Animated.View style={{ transform: [{ scale: pulseAnim }] }} className="flex-row items-center justify-center mt-2 mb-1">
                <Text className="text-base font-bold text-[#FFD700] bg-[#3B2412] px-4 py-1 rounded-full shadow-md mr-2">✨ Gold member</Text>
                <Text className="text-xs bg-[#FFD700] text-[#3B2412] px-3 py-1 rounded-full font-bold ml-1 shadow">saved ₹4558</Text>
              </Animated.View>
            </View>
          </LinearGradient>

          {/* Profile Fields Card */}
          <View className="px-6">
            <View className="bg-white dark:bg-zinc-900 rounded-2xl shadow-lg p-4 mb-6" style={{ elevation: 6 }}>
              <InputFeild
                label="Name"
                icon={icons.person}
                value={name}
                onChangeText={setName}
                placeholder="Enter your name"
                className="mb-2"
              />
              <InputFeild
                label="Mobile No."
                icon={icons.microphone}
                value={mobile}
                onChangeText={setMobile}
                placeholder="Enter your mobile number"
                keyboardType="phone-pad"
                className="mb-2"
              />
              <InputFeild
                label="Email (optional)"
                icon={icons.email}
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                keyboardType="email-address"
                className="mb-2"
              />
              <InputFeild
                label="Date of Birth (optional)"
                icon={icons.star}
                value={dob}
                onChangeText={setDob}
                placeholder="DD/MM/YYYY"
                className="mb-2"
              />

              {/* Appearance Switch */}
              <View className="flex-row items-center justify-between py-3 border-b border-neutral-200 dark:border-neutral-700">
                <View className="flex-row items-center">
                  <Text className="text-base font-JakartaSemiBold text-neutral-800 dark:text-neutral-200 mr-2">Appearance</Text>
                  <Text className="text-xs text-neutral-500">{appearance === 'light' ? 'Light' : 'Dark'}</Text>
                </View>
                <Switch
                  value={appearance === 'dark'}
                  onValueChange={() => setAppearance(appearance === 'light' ? 'dark' : 'light')}
                  thumbColor={appearance === 'dark' ? '#FF7A00' : '#f4f3f4'}
                  trackColor={{ false: '#767577', true: '#FFE5D0' }}
                />
              </View>

              {/* Address Book */}
              <TouchableOpacity className="flex-row items-center py-4 border-b border-neutral-200 dark:border-neutral-700">
                <Text className="text-base font-JakartaSemiBold text-neutral-800 dark:text-neutral-200 flex-1">Address Book</Text>
                <View className="w-6 h-6"><Text>📒</Text></View>
              </TouchableOpacity>

              {/* Help */}
              <TouchableOpacity className="flex-row items-center py-4 border-b border-neutral-200 dark:border-neutral-700">
                <Text className="text-base font-JakartaSemiBold text-neutral-800 dark:text-neutral-200 flex-1">Help</Text>
                <View className="w-6 h-6"><Text>❓</Text></View>
              </TouchableOpacity>

              {/* About */}
              <TouchableOpacity className="flex-row items-center py-4 border-b border-neutral-200 dark:border-neutral-700">
                <Text className="text-base font-JakartaSemiBold text-neutral-800 dark:text-neutral-200 flex-1">About</Text>
                <View className="w-6 h-6"><Text>ℹ️</Text></View>
              </TouchableOpacity>

              {/* Settings */}
              <TouchableOpacity className="flex-row items-center py-4 border-b border-neutral-200 dark:border-neutral-700">
                <Text className="text-base font-JakartaSemiBold text-neutral-800 dark:text-neutral-200 flex-1">Settings</Text>
                <View className="w-6 h-6"><Text>⚙️</Text></View>
              </TouchableOpacity>

              {/* Send Feedback (highlighted) */}
              <CustomButton
                title="Send Feedback"
                bgVariant="success"
                textVariant="primary"
                IconLeft={() => <View className="w-6 h-6"><Text>⭐</Text></View>}
                className="my-4"
                onPress={() => {}}
              />

              {/* Logout Button */}
              <CustomButton
                title="Logout"
                bgVariant="danger"
                IconLeft={() => <View className="w-6 h-6"><Text>🚪</Text></View>}
                onPress={() => {}}
              />
            </View>
          </View>
        </ScrollView>
      </Animated.View>
    </SafeAreaView>
  );
}
// MAKE IT COOL