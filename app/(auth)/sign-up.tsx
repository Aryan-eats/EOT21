import { useSignUp, useAuth } from "@clerk/clerk-expo";
import { View, Text, ScrollView, Image, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState, useEffect } from "react";
import { icons, images } from "@/constants";
import InputFeild from "@/components/InputFeild";
import CustomButton from "@/components/CustomButton";
import { Link, router } from "expo-router";
import Oauth from "@/components/OAuth";
import { fetchAPI } from "@/lib/fetch";
import ReactNativeModal from "react-native-modal";

const SignUp = () => {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [verification, setVerification] = useState({
    state: "default",
    error: "",
    code: "",
  });

  // useEffect(() => {
  //   if (isSignedIn) router.replace("/(root)/(tabs)/home");
  // }, [isSignedIn]);

  const onSignUpPress = async () => {
    if (!isLoaded) return;
    try {
      await signUp.create({
        emailAddress: form.email,
        password: form.password,
      });
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setVerification({
        ...verification,
        state: "pending",
      });
    } catch (err: any) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.log(JSON.stringify(err, null, 2));
      Alert.alert("Error", err.errors[0].longMessage);
    }
  };

  const onPressVerify = async () => {
    if (!isLoaded) return;
    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code: verification.code,
      });
      if (completeSignUp.status === "complete") {
        try {
          // First set the active session
          await setActive({ session: completeSignUp.createdSessionId });
          
          // Then try to create the user in our backend
          try {
            await fetchAPI("/api/user", {
              method: "POST",
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                name: form.name,
                email: form.email,
                clerkId: completeSignUp.createdUserId,
              }),
            });
          } catch (apiError) {
            console.error("API Error:", apiError);
            // Continue with the flow even if API call fails
          }

          setVerification({
            ...verification,
            state: "success",
          });
          
          // Immediately redirect after successful verification
          router.replace("/(root)/(tabs)/home");
        } catch (error) {
          console.error("Session Error:", error);
          setVerification({
            ...verification,
            error: "Failed to complete sign up. Please try again.",
            state: "failed",
          });
        }
      } else {
        setVerification({
          ...verification,
          error: "Verification failed. Please try again.",
          state: "failed",
        });
      }
    } catch (err: any) {
      console.error("Verification Error:", err);
      setVerification({
        ...verification,
        error: err.errors?.[0]?.longMessage || "An error occurred during verification",
        state: "failed",
      });
    }
  };

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="flex-1">
        <View className="relative w-full h-64 items-center justify-center">
          <Image
            source={images.getStarted}
            className="w-full h-full absolute top-0 left-0 rounded-xl"
          />
          <View className="ml-32 w-52 h-32 items-start justify-center">
            <Text className="text-4xl font-bold text-orange-500">Sign</Text>
            <View className="flex-row items-center">
              <Text className="text-white text-base mr-2">Please sign</Text>
              <Text className="absolute text-4xl font-bold text-white top-1/2 right-14 -translate-y-1/2">
                Up!
              </Text>
              <Text className="text-white text-base ml-16">to</Text>
            </View>
            <View className="flex-row gap-1">
              <Text className="text-orange-500 text-base">Your</Text>
              <Text className="text-white text-base">account</Text>
            </View>
          </View>
        </View>

        <View className="px-4 py-2">
          <InputFeild
            label="Name"
            placeholder="Enter your name"
            icon={icons.person}
            value={form.name}
            onChangeText={(val) => setForm({ ...form, name: val })}
            className="mb-2"
          />
          <InputFeild
            label="Email"
            placeholder="Enter your email"
            icon={icons.email}
            value={form.email}
            onChangeText={(val) => setForm({ ...form, email: val })}
            className="mb-2"
          />
          <InputFeild
            label="Password"
            placeholder="Enter your password"
            icon={icons.lock}
            value={form.password}
            onChangeText={(val) => setForm({ ...form, password: val })}
            className="mb-2"
          />

          <CustomButton
            title="Sign Up"
            onPress={onSignUpPress}
            className="mt-4"
          />
          <Link href="/sign-in" className="flex-row justify-center items-center mt-3">
            <Text className="text-gray-500 text-sm text-center">
              Already have an account?{" "}
            </Text>
            <Text className="text-orange-500 font-semibold text-md text-center">
              Log In
            </Text>
          </Link>
          <Oauth />
        </View>

        <ReactNativeModal
          isVisible={verification.state === "pending"}
          onModalHide={() =>
            verification.state === "success" && setShowSuccessModal(true)
          }
        >
          <View className="bg-white px-7 py-9 rounded-2xl min-h-[300px]">
            <Text className="text-2xl font-JakartaBold mb-2">
              Verify your email
            </Text>
            <Text className="text-base text-gray-400 mb-5">
              We have sent a verification code to {form.email}
            </Text>
            <InputFeild
              label="Code"
              icon={icons.lock}
              placeholder="Enter your code"
              value={verification.code}
              keyboardType="numeric"
              onChangeText={(val) =>
                setVerification({ ...verification, code: val })
              }
            />
            {verification.error && (
              <Text className="text-red-500 text-sm mt-1">
                {verification.error}
              </Text>
            )}
            <CustomButton
              title="Verify Email"
              onPress={onPressVerify}
              className="mt-4"
            />
          </View>
        </ReactNativeModal>

        <ReactNativeModal isVisible={showSuccessModal}>
          <View className="bg-white px-7 py-9 rounded-2xl min-h-[300px]">
            <Image
              source={images.check}
              className="w-[110px] h-[110px] mx-auto my-5"
            />
            <Text className="text-3xl font-JakartaBold text-center">
              VERIFIED!
            </Text>
            <Text className="text-base text-gray-400 text-center mt-2">
              Your email has been verified successfully.
            </Text>
            <CustomButton
              title="Browse Home"
              onPress={async () => {
                setShowSuccessModal(false);
                try {
                  await router.replace("/(root)/(tabs)/home");
                } catch (error) {
                  console.error("Navigation error:", error);
                  // Fallback navigation if the first attempt fails
                  router.push("/(root)/(tabs)/home");
                }
              }}
              className="mt-5"
            />
          </View>
        </ReactNativeModal>
      </View>
    </ScrollView>
  );
};

export default SignUp;
