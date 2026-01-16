import ordercard from "@/components/ordercard";
import { getorders } from "@/services/appwrite";
import useFetch from "@/services/useFetch";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Easing,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { PanGestureHandler } from "react-native-gesture-handler";

const Orders = () => {
  const [selectedFilter, setSelectedFilter] = useState("pending");
  const filters = ["Pending", "Delivered", "Canceled"];
  const filterKeys = filters.map((f) => f.toLowerCase());

  const slideAnim = useRef(new Animated.Value(0)).current;

  const [barWidth, setBarWidth] = useState(0);

  const {
    data: orders,
    loding,
    error,
    refetch,
  } = useFetch(() => getorders(selectedFilter));

  useEffect(() => {
    refetch();
  }, [selectedFilter]);

  // Smooth underline animation
  useEffect(() => {
    const index = filterKeys.indexOf(selectedFilter);
    Animated.timing(slideAnim, {
      toValue: index,
      duration: 300,
      easing: Easing.out(Easing.ease),
      useNativeDriver: false,
    }).start();
  }, [selectedFilter]);

  // Pan gesture for left/right swipe on filter bar only
  const translateX = useRef(new Animated.Value(0)).current;

  const onGestureEvent = Animated.event(
    [{ nativeEvent: { translationX: translateX } }],
    { useNativeDriver: false }
  );

  const onHandlerStateChange = ({ nativeEvent }: any) => {
    if (nativeEvent.state === 5) {
      // State.END
      const { translationX } = nativeEvent;
      const currentIndex = filterKeys.indexOf(selectedFilter);

      if (Math.abs(translationX) > 80) {
        if (translationX < -80 && currentIndex < filters.length - 1) {
          setSelectedFilter(filterKeys[currentIndex + 1]);
        } else if (translationX > 80 && currentIndex > 0) {
          setSelectedFilter(filterKeys[currentIndex - 1]);
        }
      }

      // Snap back smoothly
      Animated.spring(translateX, {
        toValue: 0,
        useNativeDriver: false,
      }).start();
    }
  };

  return (
    <View className="flex-1 bg-slate-600">
      {/* Header */}
      <View className="bg-slate-800 pt-6 pb-3 shadow-md">
        <Text className="text-white text-xl font-bold text-center">Carts</Text>
        <View className="mt-1 h-[1px] bg-slate-700/70 w-full" />
      </View>

      {/* Beautiful Filter Bar with Swipe */}
      <PanGestureHandler
        onGestureEvent={onGestureEvent}
        onHandlerStateChange={onHandlerStateChange}
      >
        <Animated.View className="bg-slate-800 shadow-md">
          <View
            className="flex-row relative"
            onLayout={(e) =>
              setBarWidth(e.nativeEvent.layout.width / filters.length)
            }
          >
            {filters.map((filter, index) => {
              const isActive = selectedFilter === filter.toLowerCase();

              return (
                <TouchableOpacity
                  key={filter}
                  activeOpacity={0.7}
                  onPress={() => setSelectedFilter(filter.toLowerCase())}
                  className="flex-1 items-center py-4"
                >
                  <Text
                    className={`text-base font-semibold transition-colors ${
                      isActive ? "text-white" : "text-slate-400"
                    }`}
                  >
                    {filter}
                  </Text>
                </TouchableOpacity>
              );
            })}

            {/* Vertical Dividers */}
            {filters.map(
              (_, index) =>
                index < filters.length - 1 && (
                  <View
                    key={`divider-${index}`}
                    className="absolute h-7 w-[1px] bg-slate-700"
                    style={{
                      left: (index + 1) * barWidth,
                      top: "50%",
                      marginTop: -14,
                    }}
                  />
                )
            )}

            {/* Animated Underline Indicator */}
            {barWidth > 0 && (
              <Animated.View
                className="absolute bottom-0 h-1 bg-indigo-500 rounded-full"
                style={{
                  width: barWidth - 16, // slightly narrower for better look
                  left: 8,
                  transform: [
                    {
                      translateX: slideAnim.interpolate({
                        inputRange: [0, 1, 2],
                        outputRange: [0, barWidth, barWidth * 2],
                      }),
                    },
                  ],
                }}
              />
            )}
          </View>
        </Animated.View>
      </PanGestureHandler>

      {/* Orders List */}
      <View className="flex-1 px-3 pt-5">
        {loding ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#34d399" />
          </View>
        ) : error ? (
          <Text className="text-red-400 text-center mt-8">
            Error loading orders
          </Text>
        ) : orders?.length === 0 ? (
          <Text className="text-slate-400 text-center mt-8">
            No {selectedFilter} orders yet.
          </Text>
        ) : (
          <FlatList
            data={orders}
            keyExtractor={(item) => item.$id}
            renderItem={ordercard}
            contentContainerStyle={{ paddingBottom: 600 }}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </View>
  );
};

export default Orders;
