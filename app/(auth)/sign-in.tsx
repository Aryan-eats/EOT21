import { useSignIn } from "@clerk/clerk-expo";
import { Link, router } from "expo-router";
import { useCallback, useState } from "react";
import { Alert, Image, ScrollView, Text, View } from "react-native";

import CustomButton from "@/components/CustomButton";
import InputField from "@/components/InputFeild";
import OAuth from "@/components/OAuth";
import { icons, images } from "@/constants";

const SignIn = () => {
  const { signIn, isLoaded, setActive } = useSignIn();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const onSignInPress = useCallback(async () => {
    if (!isLoaded) return;

    try {
      const signInAttempt = await signIn.create({
        identifier: form.email,
        password: form.password,
      });

      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace("/(root)/(tabs)/home");
      } else {
        console.log(JSON.stringify(signInAttempt, null, 2));
        Alert.alert("Error", "Log in failed. Please try again.");
      }
    } catch (err: any) {
      console.log(JSON.stringify(err, null, 2));
      Alert.alert("Error", err.errors?.[0]?.longMessage || "An error occurred during sign in");
    }
  }, [isLoaded, form, signIn, setActive]);

  return (
    <ScrollView className='flex-1 bg-white'>
      <View className='flex-1'>
        <View className='relative w-full h-80 flex items-center justify-center'>
          <Image source={images.getStarted} className='w-full h-full absolute top-0 left-0 rounded-xl' />
          <View className={`ml-32 w-52 h-40 flex items-start justify-center relative`}>
            <Text className='text-5xl font-bold text-orange-500'>Log</Text>
            <View className='w-full h-10 flex flex-row items-center justify-start relative overflow-visible'>
              <Text className='text-lg font-semibold text-white'>Please Log</Text>
              <Text className='absolute text-5xl font-bold text-white top-1/2 right-5 -translate-y-1/2 -translate-x-1/2'>In!</Text>
              <Text className='text-lg font-semibold text-white ml-16'>to</Text>
            </View>
            <View className='w-full h-10 flex justify-end flex-row gap-1'>
              <Text className='text-lg font-semibold text-orange-500'>Your</Text>
              <Text className='text-lg font-semibold text-white'>account</Text>
            </View>
          </View>
        </View>

        <View className='p-3'>
          <InputField
            label="Email"
            placeholder="Enter your email"
            icon={icons.email}
            value={form.email}
            onChangeText={(value: string) => setForm({ ...form, email: value })}
          />
          <InputField
            label="Password"
            placeholder="Enter your password"
            icon={icons.lock}
            value={form.password}
            onChangeText={(value: string) => setForm({ ...form, password: value })}
          />

          <CustomButton title="Sign In" onPress={onSignInPress} className='mt-10' />
        </View>
        <Link href="/sign-up" 
          className='flex flex-row items-center justify-center mt-3'>
          <Text className='text-center text-gray-500 text-sm'>Don't have an account? </Text>
          <Text className='text-orange-500 text-md font-semibold'>Sign up</Text>
        </Link>

        <OAuth/>
      </View>
    </ScrollView>
  );
};

export default SignIn;