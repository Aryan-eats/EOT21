import { View, Text, TouchableOpacity, Image } from "react-native";
import { useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import Swiper from "react-native-swiper";
import { onboarding } from "@/constants/index";
import CustomButton from "@/components/CustomButton";

const Onboarding = () => {
  const swiperRef = useRef<Swiper>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const isLastSlide = activeIndex === onboarding.length - 1;

  return (
    <SafeAreaView className="flex-1 bg-white justify-between items-center">
      <TouchableOpacity
        onPress={() => router.replace("/(auth)/sign-up")}
        className="w-full items-end px-5 pt-5"
      >
        <Text className="text-primary-50 text-md font-JakartaBold">Skip</Text>
      </TouchableOpacity>

      <Swiper
        ref={swiperRef}
        loop={false}
        showsPagination
        dot={<View className="w-[32px] h-[4px] mx-1 bg-[#E2E8F0] rounded-full" />}
        activeDot={<View className="w-[32px] h-[4px] mx-1 bg-primary-50 rounded-full" />}
        onIndexChanged={(index) => setActiveIndex(index)}
        style={{ flex: 1 }}
      >
        {onboarding.map((item) => (
          <View
            key={item.id.toString()}
            className="flex-1 items-center justify-center p-5"
          >
            <Image
              source={item.image}
              className="w-full h-[300px]"
              resizeMode="contain"
            />
            <View className="flex-row items-center justify-center w-full mt-10">
              <Text className="text-black text-3xl font-bold text-center mx-10">
                {item.title}
              </Text>
            </View>
            <Text className="text-md font-JakartaSemiBold text-[#858585] text-center mx-10 mt-3">
              {item.description}
            </Text>
          </View>
        ))}
      </Swiper>

      <CustomButton
        title={isLastSlide ? "Get Started" : "Next"}
        onPress={() =>
          isLastSlide
            ? router.replace("/(auth)/sign-up")
            : swiperRef.current?.scrollBy(1)
        }
        className="w-10/12 mt-4 mb-10"
      />
    </SafeAreaView>
  );
};

export default Onboarding;
