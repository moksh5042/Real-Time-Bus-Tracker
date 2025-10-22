// src/components/RouteListScreen.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { db } from "../../firebaseConfig";
import { ref, onValue } from "firebase/database";

export default function RouteListScreen({ navigation }) {
  const [routes, setRoutes] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const routesRef = ref(db, "routes");
    const unsubscribe = onValue(
      routesRef,
      (snapshot) => {
        if (snapshot.exists()) {
          setRoutes(snapshot.val());
        } else {
          setRoutes({});
        }
        setLoading(false);
      },
      (err) => {
        console.warn("Firebase error:", err);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }

  const routeArray = Object.entries(routes); // [ [id, data], ... ]

  if (routeArray.length === 0) {
    return (
      <View style={styles.center}>
        <Text>No routes found.</Text>
      </View>
    );
  }

  const renderItem = ({ item }) => {
    const [id, data] = item;
    return (
      <TouchableOpacity
        style={styles.item}
        onPress={() =>
          navigation.navigate("RouteDetails", {
            routeId: id,
            routeData: data,
          })
        }
      >
        <Text style={styles.title}>{data.name || id}</Text>
        {data.start && data.end && (
          <Text style={styles.subtitle}>
            From {data.start.lat.toFixed(3)}, {data.start.lng.toFixed(3)} →{" "}
            {data.end.lat.toFixed(3)}, {data.end.lng.toFixed(3)}
          </Text>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <FlatList
      data={routeArray}
      renderItem={renderItem}
      keyExtractor={(item) => item[0]}
      contentContainerStyle={styles.list}
    />
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  list: { padding: 16 },
  item: {
    padding: 16,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    marginBottom: 12,
    elevation: 1,
  },
  title: { fontSize: 16, fontWeight: "bold", marginBottom: 4 },
  subtitle: { fontSize: 14, color: "#666" },
});
