// // App.js
// import React from "react";
// import { NavigationContainer } from "@react-navigation/native";
// import { createStackNavigator } from "@react-navigation/stack";
// import { SafeAreaProvider } from "react-native-safe-area-context";
// import { StatusBar } from "expo-status-bar";
// import { TouchableOpacity, Text } from "react-native";

// // Import screens
// import MapScreen from "./src/components/MapScreen";
// import SearchScreen from "./src/components/SearchScreen";
// import RouteDetailsScreen from "./src/components/RouteDetailsScreen";
// import DriverDetailScreen from "./src/components/DriverDetailScreen";

// const Stack = createStackNavigator();

// export default function App() {
//   return (
//     <SafeAreaProvider>
//       <StatusBar style="dark" backgroundColor="#fff" />
//       <NavigationContainer>
//         <Stack.Navigator 
//           initialRouteName="Home"
//           screenOptions={{
//             headerStyle: {
//               backgroundColor: '#fff',
//             },
//             headerTintColor: '#333',
//             headerTitleStyle: {
//               fontWeight: 'bold',
//             },
//           }}
//         >
//           <Stack.Screen 
//             name="Home" 
//             component={MapScreen}
//             options={({ navigation }) => ({
//               title: "Nearby Buses",
//               headerRight: () => (
//                 <TouchableOpacity
//                   onPress={() => navigation.navigate('Search')}
//                   style={{ marginRight: 15 }}
//                 >
//                   <Text style={{ color: '#2196F3', fontSize: 16 }}>Search</Text>
//                 </TouchableOpacity>
//               ),
//             })}
//           />
//           <Stack.Screen 
//             name="Search" 
//             component={SearchScreen} 
//             options={{ title: "Find Route" }}
//           />
//           <Stack.Screen 
//             name="RouteDetails" 
//             component={RouteDetailsScreen}
//             options={{ title: "Route Details" }}
//           />
//           <Stack.Screen 
//             name="DriverDetail" 
//             component={DriverDetailScreen} 
//             options={{ title: "Driver Details" }} 
//           />
//         </Stack.Navigator>
//       </NavigationContainer>
//     </SafeAreaProvider>
//   );
// }




// App.js
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { TouchableOpacity, Text } from "react-native";

// Import screens
import MapScreen from "./src/components/MapScreen";
import SearchScreen from "./src/components/SearchScreen";
import RouteDetailsScreen from "./src/components/RouteDetailsScreen";
import DriverDetailScreen from "./src/components/DriverDetailScreen";
// 👇 NEW: import the list screen
import RouteListScreen from "./src/components/RouteListScreen";

const Stack = createStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" backgroundColor="#fff" />
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerStyle: { backgroundColor: "#fff" },
            headerTintColor: "#333",
            headerTitleStyle: { fontWeight: "bold" },
          }}
        >
          <Stack.Screen
            name="Home"
            component={MapScreen}
            options={({ navigation }) => ({
              title: "Nearby Buses",
              headerRight: () => (
                <TouchableOpacity
                  onPress={() => navigation.navigate("Search")}
                  style={{ marginRight: 15 }}
                >
                  <Text style={{ color: "#2196F3", fontSize: 16 }}>Search</Text>
                </TouchableOpacity>
              ),
            })}
          />

          <Stack.Screen
            name="Search"
            component={SearchScreen}
            options={{ title: "Find Route" }}
          />

          {/* 👇 NEW: Route List screen */}
          <Stack.Screen
            name="RouteList"
            component={RouteListScreen}
            options={{ title: "Available Routes" }}
          />

          <Stack.Screen
            name="RouteDetails"
            component={RouteDetailsScreen}
            options={{ title: "Route Details" }}
          />

          <Stack.Screen
            name="DriverDetail"
            component={DriverDetailScreen}
            options={{ title: "Driver Details" }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
