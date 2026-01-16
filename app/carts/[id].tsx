import Cartproduct from "@/components/cartproduct";
import { getcart, getordersid, updateOrderStatus } from "@/services/appwrite";
import useFetch from "@/services/useFetch";
import * as Linking from "expo-linking";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Easing,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

function Carts() {
  const { id } = useLocalSearchParams();

  const {
    data: cart,
    loding,
    error,
    refetch,
  } = useFetch(() => getcart(id as string));

  const {
    data: orders,
    loding: loading,
    error: ordererror,
    refetch: orefetch,
  } = useFetch(() => getordersid(id as string));

  useEffect(() => {
    if (id) {
      refetch();
      orefetch();
    }
  }, [id]);

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (cart) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 350,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();
    }
  }, [cart]);

  const callNumber = (phoneNumber) => {
    Linking.openURL(`tel:${phoneNumber}`);
  };

  // -----------------------------------------------------
  // Animation for Sticky Bottom Bar
  // -----------------------------------------------------
  const slideUp = useRef(new Animated.Value(40)).current;

  useEffect(() => {
    Animated.timing(slideUp, {
      toValue: 0,
      duration: 300,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, []);

  const statuses = ["pending", "delivered", "canceled"];

  // ⬇️⬇️ ADD THIS — local UI status state (instant button color)
  const [localStatus, setLocalStatus] = React.useState(null);

  // -----------------------------------------------------
  // Solid Pressable Button (Animated)
  // -----------------------------------------------------
  const SolidPressable = ({ active, label, onPress }) => {
    const scale = useRef(new Animated.Value(1)).current;

    const pressIn = () => {
      Animated.spring(scale, {
        toValue: 0.96,
        useNativeDriver: true,
      }).start();
    };

    const pressOut = () => {
      Animated.spring(scale, {
        toValue: 1,
        friction: 4,
        tension: 120,
        useNativeDriver: true,
      }).start();
    };

    return (
      <Animated.View
        style={{ flex: 1, transform: [{ scale }], marginHorizontal: 4 }}
      >
        <TouchableOpacity
          onPressIn={pressIn}
          onPressOut={pressOut}
          onPress={onPress}
          className={`
            py-3 rounded-xl border
            ${
              active
                ? "bg-indigo-500 border-indigo-600"
                : "bg-slate-800 border-slate-700"
            }
          `}
        >
          <Text
            className={`
              text-center font-semibold 
              ${active ? "text-slate-50" : "text-white"}
            `}
          >
            {label}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  // -----------------------------------------------------
  // Main Render
  // -----------------------------------------------------

  return (
    <View className="flex-1 bg-slate-900 px-3 pt-8">
      {loding ? (
        <Text className="text-white text-center mt-4">Loading...</Text>
      ) : error ? (
        <Text className="text-red-400 text-center mt-4">
          Error loading cart
        </Text>
      ) : cart && orders ? (
        <View className="flex-1">
          {/* Main Content Animation */}
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [
                {
                  translateY: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, 0],
                  }),
                },
              ],
            }}
            className="flex-1"
          >
            {/* Header Card */}
            <View className="bg-slate-800 rounded-t-2xl p-5 shadow-xl border border-slate-700">
              <View className="flex-row justify-between items-start">
                {/* Customer Info */}
                <View>
                  <Text className="text-white text-lg font-semibold">
                    {orders[0].Cname}
                  </Text>

                  <TouchableOpacity
                    onPress={() => callNumber(`0${orders[0].phoneNO}`)}
                  >
                    <Text className="text-slate-300 text-sm mt-1">
                      📞 0{orders[0].phoneNO}
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Total + Date */}
                <View className="items-end">
                  <Text className="text-slate-400 text-xs mt-1">
                    📅{" "}
                    {new Date(orders[0].$updatedAt).toISOString().split("T")[0]}
                  </Text>
                  <Text className="text-emerald-400 text-xl font-bold">
                    {orders[0].total}.00 ብር
                  </Text>
                </View>
              </View>

              {/* Divider */}
              <View className="h-[1px] bg-slate-700 mt-4 mb-2" />

              <Text className="text-slate-400 text-sm">Purchased Items</Text>
            </View>

            {/* Product List */}
            <FlatList
              data={cart}
              keyExtractor={(item) => item.$id}
              renderItem={({ item }) => (
                <View className="mt-3">
                  <Cartproduct product={item} />
                </View>
              )}
              contentContainerStyle={{ paddingBottom: 430 }} // space for bottom bar
              showsVerticalScrollIndicator={false}
            />
          </Animated.View>

          {/* -------------------------------------------------
                 Solid Sticky Bottom Status Bar
          --------------------------------------------------- */}
          <Animated.View
            style={{
              transform: [{ translateY: slideUp }],
            }}
            className="
              absolute bottom-5 left-0 right-0 
              mx-1 my-5 p-5 
              rounded-b-2xl
              bg-slate-800 
              border border-slate-700 
              shadow-2xl
            "
          >
            <View className="flex-row">
              {statuses.map((status) => {
                // ⬇️⬇️ UPDATED — uses localStatus OR backend value
                const isActive = (localStatus || orders[0].status) === status;

                return (
                  <SolidPressable
                    key={status}
                    label={status.charAt(0).toUpperCase() + status.slice(1)}
                    active={isActive}
                    onPress={() => {
                      setLocalStatus(status); // instant highlight
                      updateOrderStatus(id, status); // backend update
                    }}
                  />
                );
              })}
            </View>
          </Animated.View>
        </View>
      ) : (
        <Text className="text-white mt-4 text-center">No cart found</Text>
      )}
    </View>
  );
}

export default Carts;
