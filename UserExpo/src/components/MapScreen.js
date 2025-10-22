// // src/components/MapScreen.js
// import React, { useEffect, useState } from "react";
// import { View, StyleSheet, Platform } from "react-native";
// import MapView, { Marker, Callout } from "react-native-maps";
// import { subscribeToBuses } from "../services/firebaseService";

// export default function MapScreen({ navigation }) {
//   const [drivers, setDrivers] = useState({});

//   useEffect(() => {
//     const unsubscribe = subscribeToBuses((val) => {
//       setDrivers(val);
//     });
//     return () => unsubscribe();
//   }, []);

//   // default region (change to your city)
//   const initialRegion = {
//     latitude: 12.9716,
//     longitude: 77.5946,
//     latitudeDelta: 0.2,
//     longitudeDelta: 0.2,
//   };

//   return (
//     <View style={styles.container}>
//       <MapView
//         style={StyleSheet.absoluteFillObject}
//         provider="google"
//         initialRegion={initialRegion}
//         showsUserLocation={false}
//       >
//         {Object.entries(drivers).map(([driverId, data]) => {
//           if (!data || !data.lat || !data.lng) return null;
//           return (
//             <Marker
//               key={driverId}
//               coordinate={{ latitude: data.lat, longitude: data.lng }}
//               title={`Bus: ${driverId}`}
//             >
//               <Callout onPress={() => navigation?.navigate("DriverDetail", { driverId })}>
//                 {/* Simple callout content */}
//                 <View style={{ width: 200 }}>
//                   <View><Text>{`Driver: ${driverId}`}</Text></View>
//                   <View><Text>{`Speed: ${data.speed ?? 0} m/s`}</Text></View>
//                   <View><Text>{`Updated: ${new Date((data.timestamp||0)*1000).toLocaleTimeString()}`}</Text></View>
//                   <View><Text style={{color: 'blue'}}>Tap for details</Text></View>
//                 </View>
//               </Callout>
//             </Marker>
//           );
//         })}
//       </MapView>
//     </View>
//   );
// }

// import { Text } from "react-native";
// const styles = StyleSheet.create({
//   container: { flex: 1 },
// });


// src/components/MapScreen.js
// import React, { useEffect, useState } from "react";
// import { View, Text, StyleSheet, Platform } from "react-native";
// import MapView, { Marker, Callout } from "react-native-maps";
// import { subscribeToBuses } from "../services/firebaseService";

// export default function MapScreen({ navigation }) {
//   const [drivers, setDrivers] = useState({});

//   useEffect(() => {
//     const unsubscribe = subscribeToBuses((val) => {
//       console.log("Firebase data received:", val);
//       setDrivers(val);
//     });
//     return () => unsubscribe();
//   }, []);

//   // Bangalore region (matching your screenshot)
//   const initialRegion = {
//     latitude: 12.9716,
//     longitude: 77.5946,
//     latitudeDelta: 0.2,
//     longitudeDelta: 0.2,
//   };

//   return (
//     <View style={styles.container}>
//       <MapView
//         style={StyleSheet.absoluteFillObject}
//         provider={Platform.OS === 'android' ? 'google' : undefined}
//         initialRegion={initialRegion}
//         showsUserLocation={true}
//         showsMyLocationButton={true}
//         showsCompass={true}
//         showsScale={true}
//         showsBuildings={true}
//         showsTraffic={false}
//         showsIndoors={true}
//       >
//         {Object.entries(drivers).map(([driverId, data]) => {
//           if (!data || !data.lat || !data.lng) return null;
//           return (
//             <Marker
//               key={driverId}
//               coordinate={{ latitude: data.lat, longitude: data.lng }}
//               title={`Bus: ${driverId}`}
//               description={`Speed: ${data.speed ?? 0} m/s`}
//             >
//               <Callout onPress={() => navigation?.navigate("DriverDetail", { driverId })}>
//                 <View style={styles.calloutContainer}>
//                   <Text style={styles.calloutTitle}>{`Driver: ${driverId}`}</Text>
//                   <Text style={styles.calloutText}>{`Speed: ${data.speed ?? 0} m/s`}</Text>
//                   <Text style={styles.calloutText}>
//                     {`Updated: ${new Date((data.timestamp || 0) * 1000).toLocaleTimeString()}`}
//                   </Text>
//                   <Text style={styles.calloutLink}>Tap for details</Text>
//                 </View>
//               </Callout>
//             </Marker>
//           );
//         })}
//       </MapView>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { 
//     flex: 1 
//   },
//   calloutContainer: {
//     width: 200,
//     padding: 10,
//   },
//   calloutTitle: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     marginBottom: 5,
//   },
//   calloutText: {
//     fontSize: 14,
//     marginBottom: 3,
//   },
//   calloutLink: {
//     color: 'blue',
//     fontSize: 14,
//     fontWeight: '500',
//     marginTop: 5,
//   },
// });


// src/components/MapScreen.js
import React, { useEffect, useState, useRef } from "react";
import { View, Text, StyleSheet, Platform, TouchableOpacity } from "react-native";
import MapView, { Marker, Callout } from "react-native-maps";
import { subscribeToBuses } from "../services/firebaseService";

// Data for major Chandigarh bus stops
const chandigarhBusStops = [
  {
    id: 'isbt17',
    title: 'ISBT Sector 17',
    coordinate: { latitude: 30.7418, longitude: 76.7766 },
    description: 'Inter State Bus Terminal, Sector 17'
  },
  {
    id: 'isbt43',
    title: 'ISBT Sector 43',
    coordinate: { latitude: 30.7259, longitude: 76.7397 },
    description: 'Inter State Bus Terminal, Sector 43'
  },
  {
    id: 'ctu_workshop',
    title: 'CTU Workshop',
    coordinate: { latitude: 30.7335, longitude: 76.7840 },
    description: 'Chandigarh Transport Undertaking Depot'
  },
  {
    id: 'manimajra',
    title: 'Manimajra Bus Stand',
    coordinate: { latitude: 30.7289, longitude: 76.8375 },
    description: 'Local Bus Stand in Manimajra'
  },
];

export default function MapScreen({ navigation }) {
  const [drivers, setDrivers] = useState({});
  const mapRef = useRef(null); // Ref for the map view

  useEffect(() => {
    const unsubscribe = subscribeToBuses((val) => {
      console.log("Firebase data received:", val);
      setDrivers(val);
    });
    return () => unsubscribe();
  }, []);

  // Default region set to Chandigarh
  const initialRegion = {
    latitude: 30.7333,
    longitude: 76.7794,
    latitudeDelta: 0.12, // Slightly more zoomed in
    longitudeDelta: 0.12,
  };

  // Function to animate map back to initial region
  const recenterMap = () => {
    if (mapRef.current) {
      mapRef.current.animateToRegion(initialRegion, 1000); // 1-second animation
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFillObject}
        provider={Platform.OS === 'android' ? 'google' : undefined}
        initialRegion={initialRegion}
        showsUserLocation={true}
        showsMyLocationButton={true}
      >
        {/* Dynamic Markers for moving buses */}
        {Object.entries(drivers).map(([driverId, data]) => {
          if (!data || !data.lat || !data.lng) return null;
          return (
            <Marker
              key={driverId}
              coordinate={{ latitude: data.lat, longitude: data.lng }}
              title={`Bus: ${driverId}`}
            >
              <Callout onPress={() => navigation?.navigate("DriverDetail", { driverId })}>
                <View style={styles.calloutContainer}>
                  <Text style={styles.calloutTitle}>{`Driver: ${driverId}`}</Text>
                  <Text style={styles.calloutText}>{`Speed: ${data.speed ?? 0} m/s`}</Text>
                  <Text style={styles.calloutText}>
                    {`Updated: ${new Date((data.timestamp || 0) * 1000).toLocaleTimeString()}`}
                  </Text>
                  <Text style={styles.calloutLink}>Tap for details</Text>
                </View>
              </Callout>
            </Marker>
          );
        })}

        {/* Static Markers for bus stops */}
        {chandigarhBusStops.map(stop => (
          <Marker
            key={stop.id}
            coordinate={stop.coordinate}
            title={stop.title}
            description={stop.description}
            pinColor="blue" // Different color for stops
          >
             <Callout>
                <View style={{ padding: 5 }}>
                  <Text style={styles.calloutTitle}>{stop.title}</Text>
                  <Text>{stop.description}</Text>
                </View>
              </Callout>
          </Marker>
        ))}
      </MapView>

      {/* Recenter Button */}
      <TouchableOpacity style={styles.recenterButton} onPress={recenterMap}>
        <Text style={styles.buttonText}>Recenter</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  calloutContainer: {
    width: 200,
    padding: 10,
  },
  calloutTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  calloutText: {
    fontSize: 14,
    marginBottom: 3,
  },
  calloutLink: {
    color: 'blue',
    fontSize: 14,
    fontWeight: '500',
    marginTop: 5,
  },
  recenterButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    elevation: 5, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    color: '#007AFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});