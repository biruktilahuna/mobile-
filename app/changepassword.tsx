import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";
import { changePassword } from "../services/auth";

export default function ChangePassword() {
  const router = useRouter();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword) {
      Alert.alert("Error", "All fields are required");
      return;
    }

    if (newPassword.length < 8) {
      Alert.alert("Error", "Password must be at least 8 characters");
      return;
    }

    try {
      setLoading(true);
      await changePassword(currentPassword, newPassword);
      Alert.alert("Success", "Password updated successfully");
      router.back();
    } catch (error: any) {
      Alert.alert("Failed", error?.message || "Could not change password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 justify-center px-6 bg-slate-50">
      <Text className="text-2xl font-bold mb-6">Change Password</Text>

      <TextInput
        placeholder="Current password"
        secureTextEntry
        value={currentPassword}
        onChangeText={setCurrentPassword}
        className="border border-slate-300 rounded-lg px-4 py-3 mb-4 bg-white"
      />

      <TextInput
        placeholder="New password"
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
        className="border border-slate-300 rounded-lg px-4 py-6 mb-6 bg-white"
      />

      <TouchableOpacity
        onPress={handleChangePassword}
        disabled={loading}
        className={`py-4 rounded-lg ${loading ? "bg-slate-400" : "bg-black"}`}
      >
        <Text className="text-white text-center font-semibold">
          {loading ? "Updating..." : "Update Password"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
