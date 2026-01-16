import Categori from "@/components/Categori";
import TopSection from "@/components/TopSection";
import React from "react";
import { View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
// import { icons } from '@/constants/icons';

const Index = () => {
  return (
    <SafeAreaProvider>
      <View className="bg-slate-600 flex-1  ">
        {/* <ScrollView> */}
        <TopSection />
        {/* <View className="w-full bg-slate-500 p-2">
        <Text
          style={{
            fontSize: 24,
            fontWeight: "bold",
            color: "white",

            alignSelf: "center",
          }}
        >
          Categories
        </Text>
      </View> */}
        <Categori />
        {/* <ProductCard
        name={"nike"}
        price={21}
        imageUrl={
          "https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/Air_Jordan_1_Banned.jpg/960px-Air_Jordan_1_Banned.jpg"
        }
        onAddToCart={function (): void {
          throw new Error("Function not implemented.");
        }}
      /> */}
        {/* </ScrollView> */}
      </View>
    </SafeAreaProvider>
  );
};

export default Index;
