import { login } from "@/services/auth";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function LoginScreen() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Missing fields", "Enter email and password");
      return;
    }

    try {
      setLoading(true);

      await login(email.trim(), password);
      console.log("Login successful");
      router.replace("/(tabs)");
    } catch (error) {
      Alert.alert("Login failed", "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 justify-center px-6 bg-gradient-to-b from-indigo-50 to-white">
      {/* Header */}
      <Text className="text-3xl font-extrabold mb-1 text-slate-900">
        Welcome back
      </Text>
      <Text className="text-slate-600 mb-10">Sign in to continue</Text>

      {/* Email */}
      <TextInput
        placeholder="Email"
        placeholderTextColor="#94a3b8"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        className="
      border
      border-slate-300
      rounded-xl
      px-4
      py-4
      mb-4
      bg-white
      text-slate-900
    "
      />

      {/* Password */}
      <TextInput
        placeholder="Password"
        placeholderTextColor="#94a3b8"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        className="
      border
      border-slate-300
      rounded-xl
      px-4
      py-4
      mb-8
      bg-white
      text-slate-900
    "
      />

      {/* Button */}
      <TouchableOpacity
        onPress={handleLogin}
        disabled={loading}
        activeOpacity={0.85}
        className={`
      py-4
      rounded-xl
      ${loading ? "bg-indigo-300" : "bg-indigo-600"}
      shadow-sm
    `}
      >
        <Text className="text-white text-center font-semibold text-base tracking-wide">
          {loading ? "Signing in..." : "Sign In"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/forgotpassword")}>
        <Text className="text-center text-slate-600 mt-4">
          Forgot password?
        </Text>
      </TouchableOpacity>
    </View>
  );
}
