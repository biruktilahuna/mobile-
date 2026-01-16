import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { Tabs } from "expo-router";
import React from "react";
import { Image, ImageBackground, StatusBar, Text, View } from "react-native";

const TabIcon = ({ focused, icon, title }: any) => {
  if (focused) {
    return (
      <ImageBackground
        source={images.highlight}
        className="flex flex-row  flex-1 h-5 mb-3 min-w-[92px] min-h-16  mt-3 justify-center items-center rounded-full overflow-hidden"
      >
        <Image source={icon} tintColor="#151312" className="size-5" />
        <Text className="text-secondary text-base font-semibold mr-2">
          {title}
        </Text>
      </ImageBackground>
    );
  }
  return (
    <View className="size-full justify-center mt-2 rounded-full">
      <Image source={icon} tintColor="#A8B5DB" className="size-5" />
    </View>
  );
};

const _layout = () => {
  return (
    <>
      <StatusBar hidden={true} />
      <Tabs
        screenOptions={{
          tabBarShowLabel: false,
          tabBarIconStyle: {
            width: "100%",
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
            paddingLeft: 15,
            padding: 10,
            marginTop: 8,
          },
          tabBarStyle: {
            backgroundColor: "#4f5a6b",
            borderRadius: 50,
            marginHorizontal: 20,
            marginBottom: 60,
            height: 40,
            position: "absolute",
            overflow: "hidden",
            borderWidth: 1,
            borderColor: "#4f5a6b",
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "home",
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <>
                <TabIcon focused={focused} icon={icons.home} title="home" />
              </>
            ),
          }}
        />

        <Tabs.Screen
          name="orders"
          options={{
            title: "orders",
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <>
                <TabIcon focused={focused} icon={icons.orders} title="orders" />
              </>
            ),
          }}
        />
        <Tabs.Screen
          name="about"
          options={{
            title: "about",
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <>
                <TabIcon focused={focused} icon={icons.save} title="about" />
              </>
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "profile",
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <>
                <TabIcon
                  focused={focused}
                  icon={icons.person}
                  title="personal"
                />
              </>
            ),
          }}
        />
      </Tabs>
    </>
  );
};
export default _layout;
