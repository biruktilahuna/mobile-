import { deleteOrder } from "@/services/appwrite"; // adjust path if needed
import { Link } from "expo-router";
import React from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";

const OrderCardAccent = ({ item }) => {
  const orderDate = new Date(item.$updatedAt);
  const canDelete = item.status === "delivered" || item.status === "canceled";

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const orderDay = new Date(orderDate);
  orderDay.setHours(0, 0, 0, 0);

  const isToday = orderDay.getTime() === today.getTime();

  const displayDate = isToday
    ? orderDate.toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
    : orderDate.toLocaleDateString([], {
        month: "short",
        day: "numeric",
        year: "numeric",
      });

  const handleDelete = () => {
    Alert.alert("Delete Order", "Are you sure you want to delete this order?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          const success = await deleteOrder(item.$id);
          if (!success) {
            Alert.alert("Error", "Failed to delete order");
          }
        },
      },
    ]);
  };

  return (
    <Link href={`/carts/${item.$id}`} asChild>
      <TouchableOpacity activeOpacity={0.9}>
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

            <View className="flex flex-row justify-between items-center">
              <View>
                <Text className="text-gray-400">{item.status}</Text>
                <Text className="text-gray-400">{displayDate}</Text>
              </View>

              {canDelete && (
                <TouchableOpacity
                  onPress={(e) => {
                    e.stopPropagation();
                    handleDelete();
                  }}
                  className="bg-red-600 px-3 py-1 rounded-lg"
                >
                  <Text className="text-white text-sm font-semibold">
                    Delete
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Link>
  );
};

export default OrderCardAccent;
