// App.js
import React, { useEffect, useState, useRef } from "react";
import { View, StyleSheet, Alert, ScrollView } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import {
	Provider as PaperProvider,
	DefaultTheme,
	Button,
	Text,
	ActivityIndicator,
	Menu,
	Divider,
} from "react-native-paper";

import * as KeepAwake from "expo-keep-awake";
import * as Location from "expo-location";
import * as Haptics from "expo-haptics";
import * as Notifications from "expo-notifications";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { ref, set, get, child, onValue, off } from "firebase/database";
import { db } from "./firebaseConfig";

import LocationCard from "./components/LocationCard";
import StatsGrid from "./components/StatsGrid";
import ActivityLog from "./components/ActivityLog";
import { haversineDistance } from "./components/distance";

const THEME = {
	...DefaultTheme,
	colors: {
		...DefaultTheme.colors,
		primary: "#1e88e5",
		accent: "#03dac4",
	},
};

const STORAGE_KEYS = {
	BUS_ID: "busId",
	ROUTE_ID: "routeId",
	ACTIVITY_LOG: "activityLog",
};

export default function App() {
	const [hasPermission, setHasPermission] = useState(null);
	const [isTracking, setIsTracking] = useState(false);
	const [busId, setBusId] = useState(null);
	const [routeId, setRouteId] = useState(null);
	const [location, setLocation] = useState(null);
	const [activityLog, setActivityLog] = useState([]);
	const [sessionStats, setSessionStats] = useState({
		distanceMeters: 0,
		avgSpeed: 0,
	});

	// Dropdown states
	const [buses, setBuses] = useState([]);
	const [routes, setRoutes] = useState([]);
	const [busMenuVisible, setBusMenuVisible] = useState(false);
	const [routeMenuVisible, setRouteMenuVisible] = useState(false);
	const [loadingBuses, setLoadingBuses] = useState(false);
	const [loadingRoutes, setLoadingRoutes] = useState(false);

	const watchRef = useRef(null);
	const prevLocationRef = useRef(null);
	const busesListenerRef = useRef(null);
	const routesListenerRef = useRef(null);

	// Load stored values on mount
	useEffect(() => {
		(async () => {
			const storedBus = await AsyncStorage.getItem(STORAGE_KEYS.BUS_ID);
			const storedRoute = await AsyncStorage.getItem(STORAGE_KEYS.ROUTE_ID);
			const storedActivity = await AsyncStorage.getItem(
				STORAGE_KEYS.ACTIVITY_LOG
			);

			if (storedBus) setBusId(storedBus);
			if (storedRoute) setRouteId(storedRoute);

			if (storedActivity) {
				try {
					setActivityLog(JSON.parse(storedActivity));
				} catch {
					/* ignore */
				}
			}
		})();
	}, []);

	// Fetch bus IDs from Firebase using real-time listener
	const fetchBuses = async () => {
		setLoadingBuses(true);
		try {
			// First try to get current snapshot
			const snapshot = await get(child(ref(db), "busIds"));
			if (snapshot.exists()) {
				const busesData = snapshot.val();
				console.log("Buses data from Firebase:", busesData);

				if (typeof busesData === "object" && busesData !== null) {
					const busesList = Object.keys(busesData).map((key) => ({
						id: key,
						name: busesData[key].name || busesData[key] || key,
						...busesData[key],
					}));
					setBuses(busesList);
					console.log("Parsed buses list:", busesList);
				} else {
					// If busesData is not an object, treat it as array or create default
					setBuses([
						{ id: "bus_001", name: "Bus 001" },
						{ id: "bus_002", name: "Bus 002" },
						{ id: "bus_003", name: "Bus 003" },
					]);
				}
			} else {
				console.log("No buses found in database, using defaults");
				// If no buses in database, create some default ones
				setBuses([
					{ id: "bus_001", name: "Bus 001" },
					{ id: "bus_002", name: "Bus 002" },
					{ id: "bus_003", name: "Bus 003" },
				]);
			}

			// Set up real-time listener for buses
			const busesRef = ref(db, "busIds");
			busesListenerRef.current = onValue(
				busesRef,
				(snapshot) => {
					if (snapshot.exists()) {
						const busesData = snapshot.val();
						if (typeof busesData === "object" && busesData !== null) {
							const busesList = Object.keys(busesData).map((key) => ({
								id: key,
								name: busesData[key].name || busesData[key] || key,
								...busesData[key],
							}));
							setBuses(busesList);
						}
					}
				},
				(error) => {
					console.warn("Error in buses listener:", error);
				}
			);
		} catch (error) {
			console.error("Error fetching buses:", error);
			// Fallback to default buses
			setBuses([
				{ id: "bus_001", name: "Bus 001" },
				{ id: "bus_002", name: "Bus 002" },
				{ id: "bus_003", name: "Bus 003" },
			]);
		} finally {
			setLoadingBuses(false);
		}
	};

	// Fetch routes from Firebase using real-time listener
	const fetchRoutes = async () => {
		setLoadingRoutes(true);
		try {
			// First try to get current snapshot
			const snapshot = await get(child(ref(db), "routes"));
			if (snapshot.exists()) {
				const routesData = snapshot.val();
				console.log("Routes data from Firebase:", routesData);

				if (typeof routesData === "object" && routesData !== null) {
					const routesList = Object.keys(routesData).map((key) => {
						const routeData = routesData[key];

						// Handle different route data structures
						let routeName = key; // Default to key

						if (routeData.name && typeof routeData.name === "string") {
							// If there's a simple name field
							routeName = routeData.name;
						} else if (
							routeData.routeName &&
							typeof routeData.routeName === "string"
						) {
							// If there's a routeName field
							routeName = routeData.routeName;
						} else if (routeData.stop_1 && routeData.stop_3) {
							// If it's a route with stops, create descriptive name
							const firstStop = routeData.stop_1.name || "Start";
							const lastStop = routeData.stop_3.name || "End";
							routeName = `Route ${key.toUpperCase()}: ${firstStop} → ${lastStop}`;
						}

						return {
							id: key,
							name: routeName,
							...routeData,
						};
					});
					setRoutes(routesList);
					console.log("Parsed routes list:", routesList);
				} else {
					// Fallback to default routes
					setRoutes([
						{ id: "route_001", name: "Route A - City Center" },
						{ id: "route_002", name: "Route B - Airport" },
						{ id: "route_003", name: "Route C - University" },
						{ id: "route_004", name: "Route D - Mall" },
					]);
				}
			} else {
				console.log("No routes found in database, using defaults");
				// If no routes in database, create some default ones
				setRoutes([
					{ id: "route_001", name: "Route A - City Center" },
					{ id: "route_002", name: "Route B - Airport" },
					{ id: "route_003", name: "Route C - University" },
					{ id: "route_004", name: "Route D - Mall" },
				]);
			}

			// Set up real-time listener for routes
			const routesRef = ref(db, "routes");
			routesListenerRef.current = onValue(
				routesRef,
				(snapshot) => {
					if (snapshot.exists()) {
						const routesData = snapshot.val();
						if (typeof routesData === "object" && routesData !== null) {
							const routesList = Object.keys(routesData).map((key) => {
								const routeData = routesData[key];

								// Handle different route data structures
								let routeName = key; // Default to key

								if (routeData.name && typeof routeData.name === "string") {
									// If there's a simple name field
									routeName = routeData.name;
								} else if (
									routeData.routeName &&
									typeof routeData.routeName === "string"
								) {
									// If there's a routeName field
									routeName = routeData.routeName;
								} else if (routeData.stop_1 && routeData.stop_3) {
									// If it's a route with stops, create descriptive name
									const firstStop = routeData.stop_1.name || "Start";
									const lastStop = routeData.stop_3.name || "End";
									routeName = `Route ${key.toUpperCase()}: ${firstStop} → ${lastStop}`;
								}

								return {
									id: key,
									name: routeName,
									...routeData,
								};
							});
							setRoutes(routesList);
						}
					}
				},
				(error) => {
					console.warn("Error in routes listener:", error);
				}
			);
		} catch (error) {
			console.error("Error fetching routes:", error);
			// Fallback to default routes
			setRoutes([
				{ id: "route_001", name: "Route A - City Center" },
				{ id: "route_002", name: "Route B - Airport" },
				{ id: "route_003", name: "Route C - University" },
				{ id: "route_004", name: "Route D - Mall" },
			]);
		} finally {
			setLoadingRoutes(false);
		}
	};

	// Load dropdowns data on mount
	useEffect(() => {
		fetchBuses();
		fetchRoutes();

		// Cleanup listeners on unmount
		return () => {
			if (busesListenerRef.current) {
				off(ref(db, "busIds"), "value", busesListenerRef.current);
			}
			if (routesListenerRef.current) {
				off(ref(db, "routes"), "value", routesListenerRef.current);
			}
		};
	}, []);

	// Ask permission when app starts
	useEffect(() => {
		(async () => {
			const { status } = await Location.requestForegroundPermissionsAsync();
			setHasPermission(status === "granted");
			if (status !== "granted") {
				Alert.alert(
					"Permission needed",
					"Location permission is required to track the bus. Please enable it in settings."
				);
			}
		})();
	}, []);

	// Keep the screen awake when tracking
	useEffect(() => {
		if (isTracking) {
			KeepAwake.activateKeepAwakeAsync();
		} else {
			KeepAwake.deactivateKeepAwake();
		}
		return () => KeepAwake.deactivateKeepAwake();
	}, [isTracking]);

	// Helper: save activity log (only last 3)
	const persistActivityLog = async (newLog) => {
		const slice = newLog.slice(0, 3);
		setActivityLog(slice);
		await AsyncStorage.setItem(
			STORAGE_KEYS.ACTIVITY_LOG,
			JSON.stringify(slice)
		);
	};

	// Send data to Firebase Realtime Database under buses/<busId>
	const pushToFirebase = async (busIdLocal, routeIdLocal, payload) => {
		if (!busIdLocal) return;

		try {
			const busData = {
				...payload,
				busId: busIdLocal,
				routeId: routeIdLocal || null,
			};

			await set(ref(db, `buses/${busIdLocal}`), busData);
			console.log("Data pushed to Firebase for bus:", busIdLocal);
		} catch (err) {
			console.warn("Firebase push error:", err);
		}
	};

	// Called on each location update
	const handleLocationUpdate = async (loc) => {
		const { coords } = loc;
		const { latitude, longitude, speed, accuracy } = coords;
		const ts = Math.floor(Date.now() / 1000);

		// Save current location in state
		setLocation({
			latitude,
			longitude,
			speed: speed ?? 0,
			accuracy,
			timestamp: ts,
		});

		// Session distance
		const prev = prevLocationRef.current;
		let newDistance = sessionStats.distanceMeters;
		if (prev) {
			const d = haversineDistance(
				prev.latitude,
				prev.longitude,
				latitude,
				longitude
			);
			newDistance += d;
		}

		const avgSpeed = newDistance > 0 ? speed ?? 0 : 0;

		const newSession = {
			distanceMeters: newDistance,
			avgSpeed,
		};
		setSessionStats(newSession);
		prevLocationRef.current = { latitude, longitude, timestamp: ts };

		// Activity log: prepend
		const entry = {
			lat: latitude,
			lng: longitude,
			speed: speed ?? 0,
			accuracy,
			timestamp: ts,
		};
		const newLog = [entry, ...activityLog].slice(0, 3);
		await persistActivityLog(newLog);

		// If GPS accuracy poor -> haptic and notification (optional)
		if (accuracy > 50) {
			Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
			try {
				await Notifications.scheduleNotificationAsync({
					content: {
						title: "Poor GPS accuracy",
						body: `Current accuracy: ${Math.round(accuracy)}m`,
					},
					trigger: null,
				});
			} catch (err) {
				// scheduling notifications may need permission
			}
		}

		// Build payload to send to realtime DB
		const payload = {
			lat: latitude,
			lng: longitude,
			speed: speed ?? 0,
			accuracy,
			timestamp: ts,
		};

		// Push to firebase
		await pushToFirebase(busId, routeId, payload);
	};

	// Start location tracking
	const startTracking = async () => {
		if (!hasPermission) {
			Alert.alert("No permission", "Location permission not granted.");
			return;
		}

		if (!busId) {
			Alert.alert(
				"Bus ID Required",
				"Please select a bus ID before starting tracking."
			);
			return;
		}

		// Reset session stats when starting a new tracking session
		const resetSession = {
			distanceMeters: 0,
			startTime: Date.now(),
			durationSeconds: 0,
			avgSpeed: 0,
		};
		setSessionStats(resetSession);
		prevLocationRef.current = null;

		// Use watchPositionAsync for continuous updates
		try {
			const subscriber = await Location.watchPositionAsync(
				{
					accuracy: Location.Accuracy.Highest,
					timeInterval: 7000, // ~7 seconds
					distanceInterval: 0,
				},
				(loc) => {
					handleLocationUpdate(loc);
				}
			);
			watchRef.current = subscriber;
			setIsTracking(true);

			// Also immediately fetch one snapshot
			const last = await Location.getLastKnownPositionAsync();
			if (last) handleLocationUpdate(last);
		} catch (err) {
			console.warn("Failed to start location watch:", err);
			Alert.alert("Error", "Could not start location tracking. Is GPS on?");
		}
	};

	// Stop tracking
	const stopTracking = async () => {
		try {
			if (watchRef.current) {
				watchRef.current.remove();
				watchRef.current = null;
			}
			setIsTracking(false);
			prevLocationRef.current = null;

			// Reset session stats when stopping tracking
			setSessionStats({
				distanceMeters: 0,
				startTime: null,
				durationSeconds: 0,
				avgSpeed: 0,
			});
		} catch (err) {
			console.warn("Error stopping tracking:", err);
		}
	};

	// Handle bus selection
	const handleBusSelect = async (selectedBus) => {
		setBusId(selectedBus.id);
		setBusMenuVisible(false);
		await AsyncStorage.setItem(STORAGE_KEYS.BUS_ID, selectedBus.id);
	};

	// Handle route selection
	const handleRouteSelect = async (selectedRoute) => {
		setRouteId(selectedRoute.id);
		setRouteMenuVisible(false);
		await AsyncStorage.setItem(STORAGE_KEYS.ROUTE_ID, selectedRoute.id);
	};

	const selectedBus = buses.find((b) => b.id === busId);
	const selectedRoute = routes.find((r) => r.id === routeId);

	return (
		<SafeAreaProvider>
			<PaperProvider theme={THEME}>
				<View style={styles.container}>
					{!hasPermission && hasPermission !== null ? (
						<View style={styles.center}>
							<Text>You must grant location permission for tracking.</Text>
							<Button
								mode="contained"
								onPress={async () => {
									const { status } =
										await Location.requestForegroundPermissionsAsync();
									setHasPermission(status === "granted");
								}}
							>
								Request Permission
							</Button>
						</View>
					) : (
						<ScrollView
							style={styles.content}
							contentContainerStyle={{ paddingBottom: 40 }}
							showsVerticalScrollIndicator={false}
						>
							{/* App Title */}
							<View style={styles.titleContainer}>
								<Text style={styles.appTitle}>Bus Tracker</Text>
								{busId && (
									<Text style={styles.selectedBusText}>
										Selected: {selectedBus?.name || busId}
									</Text>
								)}
							</View>

							{/* Bus ID Selection Dropdown */}
							<View style={styles.dropdownContainer}>
								<Text style={styles.dropdownLabel}>Select Bus ID:</Text>
								<Menu
									visible={busMenuVisible}
									onDismiss={() => setBusMenuVisible(false)}
									anchor={
										<Button
											mode="outlined"
											onPress={() => setBusMenuVisible(true)}
											style={[
												styles.dropdownButton,
												!busId && styles.dropdownButtonRequired,
											]}
											contentStyle={styles.dropdownButtonContent}
											disabled={isTracking || loadingBuses}
										>
											{loadingBuses ? (
												<ActivityIndicator size="small" />
											) : (
												selectedBus?.name || "Choose Bus ID *"
											)}
										</Button>
									}
								>
									{buses.map((bus) => (
										<Menu.Item
											key={bus.id}
											onPress={() => handleBusSelect(bus)}
											title={bus.name}
										/>
									))}
									<Divider />
									<Menu.Item
										onPress={() => {
											setBusMenuVisible(false);
											fetchBuses();
										}}
										title="Refresh Bus IDs"
									/>
								</Menu>
							</View>

							{/* Route Selection Dropdown */}
							<View style={styles.dropdownContainer}>
								<Text style={styles.dropdownLabel}>
									Select Route (Optional):
								</Text>
								<Menu
									visible={routeMenuVisible}
									onDismiss={() => setRouteMenuVisible(false)}
									anchor={
										<Button
											mode="outlined"
											onPress={() => setRouteMenuVisible(true)}
											style={styles.dropdownButton}
											contentStyle={styles.dropdownButtonContent}
											disabled={isTracking || loadingRoutes}
										>
											{loadingRoutes ? (
												<ActivityIndicator size="small" />
											) : (
												selectedRoute?.name || "Choose Route"
											)}
										</Button>
									}
								>
									<Menu.Item
										onPress={() =>
											handleRouteSelect({ id: null, name: "No Route" })
										}
										title="No Route"
									/>
									<Divider />
									{routes.map((route) => (
										<Menu.Item
											key={route.id}
											onPress={() => handleRouteSelect(route)}
											title={route.name}
										/>
									))}
									<Divider />
									<Menu.Item
										onPress={() => {
											setRouteMenuVisible(false);
											fetchRoutes();
										}}
										title="Refresh Routes"
									/>
								</Menu>
							</View>

							<LocationCard location={location} />
							<StatsGrid session={sessionStats} />
							<ActivityLog items={activityLog} />

							<View style={styles.controls}>
								{isTracking ? (
									<Button mode="contained" onPress={stopTracking}>
										Stop Tracking
									</Button>
								) : (
									<Button
										mode="contained"
										onPress={startTracking}
										disabled={!busId}
									>
										Start Tracking
									</Button>
								)}
							</View>
						</ScrollView>
					)}
				</View>
			</PaperProvider>
		</SafeAreaProvider>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, backgroundColor: "#f6f8fb" },
	content: { flex: 1, padding: 16, paddingBottom: 40 },
	center: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		padding: 16,
	},
	controls: { marginTop: 16, alignItems: "center", justifyContent: "center" },
	dropdownContainer: {
		marginBottom: 16,
	},
	dropdownLabel: {
		fontSize: 16,
		fontWeight: "600",
		marginBottom: 8,
		color: "#333",
	},
	dropdownButton: {
		borderRadius: 8,
		borderWidth: 1.5,
		borderColor: "#1e88e5",
	},
	dropdownButtonRequired: {
		borderColor: "#e74c3c",
	},
	dropdownButtonContent: {
		paddingVertical: 8,
		justifyContent: "flex-start",
	},
	titleContainer: {
		alignItems: "center",
		marginBottom: 24,
		paddingTop: 20,
	},
	appTitle: {
		fontSize: 28,
		fontWeight: "bold",
		color: "#1e88e5",
		marginBottom: 8,
	},
	selectedBusText: {
		fontSize: 16,
		color: "#666",
		fontWeight: "500",
	},
});
