// import React from "react";
// import { View, Text, StyleSheet } from "react-native";

// export default function RouteDetailsScreen({ route }) {
//   const { routeId } = route.params || {};

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Route Details</Text>
//       <Text>{routeId ? `Showing details for route: ${routeId}` : "No route selected."}</Text>
//       {/* TODO: Fetch route data from Firebase if available */}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 16 },
//   title: { fontSize: 20, fontWeight: "bold", marginBottom: 8 },
// });



import React, { useEffect, useState } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import { db } from "../../firebaseConfig";
import { ref, onValue } from "firebase/database";

const RouteDetailsScreen = ({ route }) => {
  const { routeData, routeId, busId } = route.params;
  const [busLocation, setBusLocation] = useState(null);

  // Subscribe to live bus location
  useEffect(() => {
    if (!busId) return;
    const busRef = ref(db, `buses/${busId}`);
    const unsub = onValue(busRef, (snap) => {
      if (snap.exists()) setBusLocation(snap.val());
    });
    return () => unsub();
  }, [busId]);

  // Build coordinates for polyline
  const routeCoords = routeData.stops.map((stopName) => {
    // We only passed names in SearchScreen, better to reload full route from Firebase
    // But for now assume we also passed coords with stops
    return stopName.coords ? stopName.coords : null;
  }).filter(Boolean);

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: busLocation ? busLocation.lat : 12.9716,
          longitude: busLocation ? busLocation.lng : 77.5946,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        {/* Route polyline */}
        {routeCoords.length > 1 && (
          <Polyline
            coordinates={routeCoords}
            strokeColor="#2196F3"
            strokeWidth={5}
          />
        )}

        {/* Bus marker */}
        {busLocation && (
          <Marker
            coordinate={{ latitude: busLocation.lat, longitude: busLocation.lng }}
            title={`Bus ${busId}`}
            description={`Live location`}
          />
        )}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { width: Dimensions.get("window").width, height: Dimensions.get("window").height },
});

export default RouteDetailsScreen;
