import { getCurrentUser } from "@/services/auth";
import { Redirect, Stack, usePathname } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, StatusBar, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "./globals.css";

export default function RootLayout() {
  const pathname = usePathname();
  const publicRoutes = ["/login", "/forgotpassword", "/reset-password"];
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    getCurrentUser().then((u) => {
      setUser(u);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" />
          </View>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    );
  }
  console.log("Current user:", user);
  // 🔐 Not logged in → allow ONLY /login
  // if (!user && pathname !== "/login") {
  //   return <Redirect href="/login" />;
  // }
  if (!user && !publicRoutes.includes(pathname)) {
    return <Redirect href="/login" />;
  }
  // ✅ Logged in → block login page
  if (user && pathname === "/login") {
    return <Redirect href="/(tabs)" />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar hidden={false} barStyle="light-content" />

        <Stack
          screenOptions={{
            contentStyle: {
              backgroundColor: "#f8fafc",
              paddingHorizontal: 0,
              paddingTop: 0,
            },
          }}
        >
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="carts/[id]" options={{ headerShown: false }} />
        </Stack>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
