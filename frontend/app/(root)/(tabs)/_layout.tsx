import React from "react";
import { Tabs } from "expo-router";
import { Image, ImageSourcePropType, View, Text } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSelector } from 'react-redux';

import { icons } from "@/constants/icons";

const TabIcon = ({
  source,
  focused,
  cartCount
}: {
  source: ImageSourcePropType;
  focused: boolean;
  cartCount?: number;
}) => (
  <View
    className={`flex flex-row w-full justify-center items-center rounded-full ${focused ? "bg-[#FF6600]" : ""}`}
  >
    <View
      className={`rounded-full w-12 h-12 items-center justify-center ${focused ? "bg-[#FF6600]" : ""}`}
      style={{ position: 'relative' }}
    >
      <Image
        source={source}
        tintColor={focused ? "white" : "black"}
        resizeMode="contain"
        className="w-8 h-8"
      />
      {/* Cart count badge */}
      {typeof cartCount === 'number' && cartCount > 0 && (
        <View style={{ position: 'absolute', top: 2, right: 2 }} className="bg-orange-500 rounded-full w-5 h-5 items-center justify-center z-10">
          <Text className="text-white text-xs font-bold">{cartCount}</Text>
        </View>
      )}
    </View>
  </View>
);

export default function Layout() {
  const cartItems = useSelector((state: any) => state.cart.items);
  const cartCount = cartItems.reduce((sum: number, item: any) => sum + item.quantity, 0);
  return (
    <>
      <StatusBar style="dark"  />
      <Tabs
        initialRouteName="home"
        screenOptions={{
          tabBarActiveTintColor: "#FF6600",
          tabBarInactiveTintColor: "black",
          tabBarShowLabel: false,
          tabBarStyle: {
            backgroundColor: "white",
            borderRadius: 0,
            paddingVertical: 8,
            overflow: "hidden",
            marginHorizontal: 0,
            marginBottom: 0,
            height: 65,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row",
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            width: "100%",
          },
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: "Home",
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <TabIcon source={icons.home} focused={focused} />
            ),
          }}
        />
        <Tabs.Screen
          name="ReOrder"
          options={{
            title: "ReOrder",
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <TabIcon source={icons.list} focused={focused} />
            ),
          }}
        />
        <Tabs.Screen
          name="Cart"
          options={{
            title: "Cart",
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <TabIcon source={icons.cart} focused={focused} cartCount={cartCount} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <TabIcon source={icons.profile} focused={focused} />
            ),
          }}
        />
      </Tabs>
    </>
  );
}