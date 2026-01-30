import { account } from "@/services/appwrite";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function ResetPassword() {
  const { userId, secret } = useLocalSearchParams<{
    userId: string;
    secret: string;
  }>();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const handleReset = async () => {
    if (!password || password !== confirm) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    try {
      await account.updateRecovery(userId!, secret!, password);

      Alert.alert("Success", "Password updated");
      router.replace("/login");
    } catch {
      Alert.alert("Error", "Invalid or expired reset link");
    }
  };

  return (
    <View className="flex-1 justify-center px-6 bg-slate-50">
      <Text className="text-2xl font-bold mb-6">Reset password</Text>

      <TextInput
        placeholder="New password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        className="border border-slate-300 rounded-lg px-4 py-3 mb-4 bg-white"
      />

      <TextInput
        placeholder="Confirm password"
        secureTextEntry
        value={confirm}
        onChangeText={setConfirm}
        className="border border-slate-300 rounded-lg px-4 py-3 mb-6 bg-white"
      />

      <TouchableOpacity
        onPress={handleReset}
        className="py-4 rounded-lg bg-black"
      >
        <Text className="text-white text-center font-semibold">
          Update password
        </Text>
      </TouchableOpacity>
    </View>
  );
}
