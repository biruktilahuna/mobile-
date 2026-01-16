import React, { useEffect, useRef } from "react";
import { Animated, Easing, Image, Text, View } from "react-native";

function Cartproduct({ product }) {
  const fade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fade, {
      toValue: 1,
      duration: 250,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View
      style={{
        opacity: fade,
        transform: [
          {
            translateY: fade.interpolate({
              inputRange: [0, 1],
              outputRange: [12, 0],
            }),
          },
        ],
      }}
      className="
        flex-row
        bg-slate-800
        rounded-2xl
        p-4
        border border-slate-700
        overflow-hidden
      "
    >
      {/* Accent Bar */}
      <View className="w-1.5 bg-indigo-500 rounded-full mr-4" />

      {/* Image */}
      <Image
        source={{ uri: product.image }}
        className="w-20 h-20 rounded-xl mr-4"
        resizeMode="cover"
      />

      {/* Info */}
      <View className="flex-1 justify-center">
        {/* Product name – primary */}
        <Text className="text-white text-base font-semibold">
          {product.Pname}
        </Text>

        {/* Quantity – secondary */}
        <Text className="text-slate-50 text-sm mt-1">
          Qty: {product.ProductNo}
        </Text>

        {/* Price – highlight */}
        <Text className=" text-base font-bold mt-2 text-white">
          {product.price}.00{" "}
          <Text className="font-semibold text-xs tracking-widest">ETB</Text>
        </Text>
      </View>
    </Animated.View>
  );
}

export default Cartproduct;
