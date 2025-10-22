import React, { useEffect, useState } from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import MapView, { Polyline, Marker } from "react-native-maps";
import { subscribeToRoutes } from "../services/routeService";
import polyline from "@mapbox/polyline";

const GOOGLE_MAPS_API_KEY = "AIzaSyCMfkR-q8J4j6Nb-mMmBYRM2Cxe_2yAtqY";

export default function RouteMapScreen() {
  const [routes, setRoutes] = useState({});
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [polyCoords, setPolyCoords] = useState([]);

  // Load route list
  useEffect(() => {
    const unsub = subscribeToRoutes((data) => {
      setRoutes(data);
      // auto-select first for demo
      const firstKey = Object.keys(data)[0];
      if (firstKey) setSelectedRoute({ id: firstKey, ...data[firstKey] });
    });
    return () => unsub();
  }, []);

  // Fetch polyline when route selected
  useEffect(() => {
    if (!selectedRoute) return;
    const { start, end, waypoints } = selectedRoute;
    const wayStr = waypoints?.map(w => `${w.lat},${w.lng}`).join("|") || "";
    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${start.lat},${start.lng}&destination=${end.lat},${end.lng}&key=${GOOGLE_MAPS_API_KEY}&waypoints=${wayStr}`;
    fetch(url)
      .then(res => res.json())
      .then(json => {
        if (json.routes?.length) {
          const points = json.routes[0].overview_polyline.points;
          const coords = polyline.decode(points).map(([lat, lng]) => ({ latitude: lat, longitude: lng }));
          setPolyCoords(coords);
        }
      })
      .catch(err => console.error("Directions error", err));
  }, [selectedRoute]);

  if (!selectedRoute) return <ActivityIndicator style={{ flex:1 }} />;

  const { start, end } = selectedRoute;

  return (
    <View style={styles.container}>
      <MapView
        style={StyleSheet.absoluteFillObject}
        provider="google"
        initialRegion={{
          latitude: start.lat,
          longitude: start.lng,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1
        }}
      >
        <Marker coordinate={{ latitude: start.lat, longitude: start.lng }} title="Start" />
        <Marker coordinate={{ latitude: end.lat, longitude: end.lng }} title="End" />
        <Polyline coordinates={polyCoords} strokeWidth={4} strokeColor="#1E90FF" />
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 }
});
