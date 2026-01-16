// import MapComponent from "@/components/MapComponent";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function Profile() {
  // const regional = {
  //   latitude: 37.7749,
  //   longitude: -122.4194,
  //   latitudeDelta: 0.05,
  //   longitudeDelta: 0.05,
  // };

  return (
    <View style={styles.container}>
      {/* <MapComponent region={regional} height={400} title="San Francisco" /> */}

      <Text>Profile Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
  },
});
