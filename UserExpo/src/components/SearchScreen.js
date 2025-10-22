import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { db } from "../../firebaseConfig";
import { ref, onValue } from "firebase/database";

const SearchScreen = ({ navigation }) => {
  const [fromStop, setFromStop] = useState("");
  const [toStop, setToStop] = useState("");
  const [showFromModal, setShowFromModal] = useState(false);
  const [showToModal, setShowToModal] = useState(false);
  const [allRoutes, setAllRoutes] = useState({});
  const [buses, setBuses] = useState({});
  const [searchResults, setSearchResults] = useState([]);

  /** 🔹 Load all routes */
  useEffect(() => {
    const routesRef = ref(db, "routes");
    return onValue(routesRef, (snap) => {
      if (snap.exists()) setAllRoutes(snap.val());
    });
  }, []);

  /** 🔹 Load live buses */
  useEffect(() => {
    const busesRef = ref(db, "buses");
    return onValue(busesRef, (snap) => {
      if (snap.exists()) setBuses(snap.val());
      else setBuses({});
    });
  }, []);

  /** 🔹 Build stop list */
  const busStops = useMemo(() => {
    const stops = [];
    Object.values(allRoutes).forEach((stopsObj) => {
      Object.values(stopsObj).forEach((s) => {
        if (s && s.name) stops.push(s.name);
      });
    });
    return [...new Set(stops)];
  }, [allRoutes]);

  /** 🔹 Search routes */
  const searchRoutes = () => {
    if (!fromStop || !toStop) return;
    const matches = [];

    Object.entries(allRoutes).forEach(([routeId, stopsObj]) => {
      const stopsArr = Object.entries(stopsObj)
        .sort(([a], [b]) => parseInt(a.split("_")[1]) - parseInt(b.split("_")[1]))
        .map(([_, val]) => val);

      const stopNames = stopsArr.map((s) => s.name);
      const fromIndex = stopNames.indexOf(fromStop);
      const toIndex = stopNames.indexOf(toStop);

      if (fromIndex !== -1 && toIndex !== -1 && fromIndex < toIndex) {
        const busesOnRoute = Object.entries(buses)
          .filter(([_, b]) => b.route === routeId)
          .map(([busId, b]) => ({ id: busId, ...b }));

        matches.push({
          id: routeId,
          name: `Route ${routeId.toUpperCase()}`,
          stops: stopsArr, // full objects with name, lat, lng
          start: stopNames[0],
          end: stopNames[stopNames.length - 1],
          buses: busesOnRoute,
        });
      }
    });

    setSearchResults(matches);
  };

  const swapStops = () => {
    setFromStop(toStop);
    setToStop(fromStop);
  };

  const renderStopModal = (visible, onClose, onSelect, title) => (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{title}</Text>
          <ScrollView>
            {busStops.map((stop, index) => (
              <TouchableOpacity key={index} style={styles.stopItem} onPress={() => onSelect(stop)}>
                <Text style={styles.stopText}>{stop}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  const renderRouteResult = (route, idx) => (
    <View key={idx} style={styles.routeCard}>
      <Text style={styles.routeName}>{route.name}</Text>
      <Text style={styles.routeStops}>
        {route.start} → {route.end}
      </Text>
      <Text style={styles.waypoints}>
        Path: {route.stops.map((s) => s.name).join(" → ")}
      </Text>

      {route.buses && route.buses.length > 0 ? (
        <View style={{ marginTop: 10 }}>
          <Text style={{ fontWeight: "600", marginBottom: 5 }}>Live Buses:</Text>
          {route.buses.map((b) => (
            <TouchableOpacity
              key={b.id}
              onPress={() =>
                navigation.navigate("RouteDetails", {
                  routeId: route.id,
                  routeData: route,
                  busId: b.id,
                })
              }
            >
              <Text style={{ color: "#2196F3" }}>
                🚌 {b.id} @ ({b.lat.toFixed(3)}, {b.lng.toFixed(3)})
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      ) : (
        <Text style={{ marginTop: 8, color: "gray" }}>No buses currently on this route</Text>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* From Stop */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>From</Text>
        <TouchableOpacity style={styles.dropdown} onPress={() => setShowFromModal(true)}>
          <Text style={[styles.dropdownText, !fromStop && styles.placeholder]}>
            {fromStop || "Select source stop"}
          </Text>
          <Text style={styles.dropdownArrow}>▼</Text>
        </TouchableOpacity>
      </View>

      {/* To Stop */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>To</Text>
        <View style={styles.toContainer}>
          <TouchableOpacity style={styles.dropdownWithSwap} onPress={() => setShowToModal(true)}>
            <Text style={[styles.dropdownText, !toStop && styles.placeholder]}>
              {toStop || "Select destination stop"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.swapButton} onPress={swapStops}>
            <View style={styles.swapIcon}>
              <Text style={styles.swapText}>⇅</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Button */}
      <TouchableOpacity style={styles.searchButton} onPress={searchRoutes}>
        <Text style={styles.searchButtonText}>Search Routes</Text>
      </TouchableOpacity>

      {/* Results */}
      {searchResults.length > 0 && (
        <ScrollView style={styles.resultsContainer}>
          {searchResults.map(renderRouteResult)}
        </ScrollView>
      )}

      {/* Stop Modals */}
      {renderStopModal(showFromModal, () => setShowFromModal(false), setFromStop, "Select source stop")}
      {renderStopModal(showToModal, () => setShowToModal(false), setToStop, "Select destination stop")}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fa", paddingHorizontal: 20 },
  section: { marginBottom: 20 },
  sectionLabel: { fontSize: 16, fontWeight: "600", color: "#333", marginBottom: 8 },
  dropdown: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  dropdownWithSwap: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  dropdownText: { fontSize: 16, color: "#333" },
  placeholder: { color: "#999" },
  dropdownArrow: { color: "#666", fontSize: 12 },
  toContainer: { flexDirection: "row", alignItems: "center" },
  swapButton: { marginLeft: 10 },
  swapIcon: {
    width: 48,
    height: 48,
    backgroundColor: "#e0e0e0",
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  swapText: { fontSize: 20, color: "#666" },
  searchButton: {
    backgroundColor: "#2196F3",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    marginBottom: 20,
  },
  searchButtonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  resultsContainer: { flex: 1 },
  routeCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  routeName: { fontSize: 16, fontWeight: "600", color: "#333", marginBottom: 4 },
  routeStops: { fontSize: 14, color: "#555", marginBottom: 4 },
  waypoints: { fontSize: 13, color: "#777", fontStyle: "italic" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    width: "90%",
    maxHeight: "70%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 20,
    textAlign: "left",
  },
  stopItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  stopText: { fontSize: 16, color: "#333" },
});

export default SearchScreen;
