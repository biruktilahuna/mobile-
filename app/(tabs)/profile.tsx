import { getCurrentUser, logout } from "@/services/auth";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image, Pressable, Text, View } from "react-native";

const router = useRouter();

export default function Profile() {
  const [user, setUser] = useState<any>(null);

  const handleLogout = async () => {
    await logout();
    router.replace("/login");
  };

  const handleChangePassword = () => {
    router.push("/changepassword");
  };

  useEffect(() => {
    getCurrentUser().then((u) => {
      setUser(u);
    });
  }, []);
  return (
    <View className="flex-1 bg-slate-600 px-5 pt-12">
      
      {/* Header */}
      <View className="items-center mb-8 mt-8">
         <Image
        source={{
          uri: "https://img.icons8.com/color/1200/person-male.jpg",
        }}
        resizeMode="cover"
        className="w-24 h-24 rounded-full mb-3 bg-gray-300 "
      />
        <Text className="text-xl font-semibold text-gray-300">
          {user?.name}
          </Text>
        
        <Text className="text-sm text-gray-400 mt-1">Account Settings</Text>
        <Text className="text-sm text-gray-400 mt-1">{user?.email}</Text>
      </View>
     
      {/* Card */}
      <View className="bg-slate-700 rounded-xl shadow-sm overflow-hidden">
        <Pressable
          onPress={handleChangePassword}
          className="px-5 py-4 active:bg-gray-100"
        >
          <Text className="text-base text-gray-300">🔒 Change Password</Text>
        </Pressable>

        <View className="h-px bg-gray-200 mx-5" />

        <Pressable
          onPress={handleLogout}
          className="px-5 py-4 active:bg-red-50"
        >
          <Text className="text-base font-medium text-red-600">🚪 Logout</Text>
        </Pressable>
      </View>
    </View>
  );
}
