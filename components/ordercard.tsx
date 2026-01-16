import { Link } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

const OrderCardAccent = ({ item }) => {
  // Get the order's updated date
  const orderDate = new Date(item.$updatedAt);

  // Get today's date (without time) for comparison
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const orderDay = new Date(orderDate);
  orderDay.setHours(0, 0, 0, 0);

  // Check if the order was updated today
  const isToday = orderDay.getTime() === today.getTime();

  // Format accordingly
  const displayDate = isToday
    ? orderDate.toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }) // e.g., 3:45 PM
    : orderDate.toLocaleDateString([], {
        month: "short",
        day: "numeric",
        year: "numeric",
      }); // e.g., Dec 29, 2025

  return (
    <Link href={`/carts/${item.$id}`} asChild>
      <TouchableOpacity>
        <View className="bg-slate-700 m-2 p-0 rounded-xl overflow-hidden shadow-lg">
          <View className="h-1.5 bg-indigo-500" />
          <View className="p-4">
            <View className="flex flex-row justify-between mb-2">
              <View>
                <Text className="text-white text-lg font-semibold">
                  {item.Cname}
                </Text>
                <Text className="text-gray-300 text-sm">
                  Phone: 0{item.phoneNO}
                </Text>
              </View>
              <Text className="text-white font-semibold text-lg">
                {item.total}.00 ETB
              </Text>
            </View>
            <View className="flex flex-row justify-between">
              <Text className="text-gray-400">{item.status}</Text>
              <Text className="text-gray-400">{displayDate}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Link>
  );
};

export default OrderCardAccent;
