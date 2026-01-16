import { useEffect, useRef } from "react";
import { StyleSheet, View } from "react-native";
import MapView, { Marker, PROVIDER_DEFAULT, UrlTile } from "react-native-maps";

const MAPTILER_KEY = process.env.EXPO_PUBLIC_MAP_API_KEY;

const MapComponent = ({ region, height = 300, title }) => {
  const mapRef = useRef(null);

  useEffect(() => {
    if (region?.latitude && mapRef.current) {
      mapRef.current.animateToRegion(region, 1000);
    }
  }, [region]);

  return (
    <View style={[styles.container, { height }]}>
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFill}
        initialRegion={region}
        provider={PROVIDER_DEFAULT}
        mapType="none"
      >
        <UrlTile
          urlTemplate={`https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=${MAPTILER_KEY}`}
          maximumZ={20}
          tileSize={256}
          zIndex={-1}
        />

        {region && <Marker coordinate={region} title={title} />}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: "#e5e5e5",
  },
});

export default MapComponent;
