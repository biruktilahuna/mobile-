import { account } from "@/services/appwrite";
import { router } from "expo-router";
import { useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (!email) {
      Alert.alert("Error", "Please enter your email");
      return;
    }

    try {
      setLoading(true);

      await account.createRecovery(
        email,
        "bareboon://reset-password", // deep link
      );

      Alert.alert("Check your email", "We sent you a password reset link.");

      router.back();
    } catch (err) {
      Alert.alert("Error", "Could not send reset email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 justify-center px-6 bg-slate-50">
      <Text className="text-2xl font-bold mb-2">Forgot password</Text>
      <Text className="text-slate-500 mb-8">
        Enter your email to reset your password
      </Text>

      <TextInput
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        className="border border-slate-300 rounded-lg px-4 py-3 mb-6 bg-white"
      />

      <TouchableOpacity
        onPress={handleReset}
        disabled={loading}
        className={`py-4 rounded-lg ${loading ? "bg-slate-400" : "bg-black"}`}
      >
        <Text className="text-white text-center font-semibold">
          {loading ? "Sending..." : "Send reset link"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
