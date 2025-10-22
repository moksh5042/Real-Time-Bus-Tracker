// import React, { useEffect, useState } from "react";
// import { View, Text, StyleSheet } from "react-native";
// import { db } from "../services/firebaseConfig";
// import { ref, onValue } from "firebase/database";

// export default function DriverDetailScreen({ route }) {
//   const { driverId } = route.params;
//   const [data, setData] = useState(null);

//   useEffect(() => {
//     const driverRef = ref(db, `buses/${driverId}`);
//     const unsub = onValue(driverRef, (snap) => {
//       setData(snap.val());
//     });
//     return () => unsub();
//   }, [driverId]);

//   if (!data) {
//     return (
//       <View style={styles.container}>
//         <Text>No data available for driver {driverId}</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Driver {driverId}</Text>
//       <Text>Latitude: {data.lat}</Text>
//       <Text>Longitude: {data.lng}</Text>
//       <Text>Speed: {data.speed ?? "N/A"} m/s</Text>
//       <Text>Last Update: {new Date((data.timestamp || 0) * 1000).toLocaleString()}</Text>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 16 },
//   title: { fontSize: 20, fontWeight: "bold", marginBottom: 12 },
// });



import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { db } from "../../firebaseConfig";  // Fixed import path
import { ref, onValue } from "firebase/database";

export default function DriverDetailScreen({ route }) {
  const { driverId } = route.params;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const driverRef = ref(db, `buses/${driverId}`);
    const unsub = onValue(driverRef, (snap) => {
      setData(snap.val());
      setLoading(false);
    });
    return () => unsub();
  }, [driverId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
        <Text style={styles.loadingText}>Loading driver details...</Text>
      </View>
    );
  }

  if (!data) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No data available for driver {driverId}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Driver {driverId}</Text>
      <View style={styles.infoContainer}>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Latitude:</Text>
          <Text style={styles.value}>{data.lat}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Longitude:</Text>
          <Text style={styles.value}>{data.lng}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Speed:</Text>
          <Text style={styles.value}>{data.speed ?? "N/A"} m/s</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Last Update:</Text>
          <Text style={styles.value}>
            {new Date((data.timestamp || 0) * 1000).toLocaleString()}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f8f9fa',
    padding: 16 
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  title: { 
    fontSize: 24, 
    fontWeight: "bold", 
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  infoContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  value: {
    fontSize: 16,
    color: '#666',
    flex: 1,
    textAlign: 'right',
  },
  errorText: {
    fontSize: 16,
    color: '#ff4444',
    textAlign: 'center',
  },
});