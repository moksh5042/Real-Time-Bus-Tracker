// components/HeaderComponent.js
import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Appbar, TextInput, Button, Text } from "react-native-paper";

export default function HeaderComponent({ driverId, onChangeDriverId }) {
  const [localId, setLocalId] = useState(driverId ?? "");

  return (
    <>
      <Appbar.Header>
        <Appbar.Content title="Bus Driver Tracker" subtitle="Realtime GPS tracking" />
      </Appbar.Header>
      <View style={styles.container}>
        <Text style={styles.label}>Driver ID</Text>
        <TextInput
          mode="outlined"
          placeholder="Enter driver ID"
          value={localId}
          onChangeText={setLocalId}
          style={styles.input}
        />
        <Button
          mode="contained"
          onPress={() => {
            if (!localId) return;
            onChangeDriverId(localId);
          }}
        >
          Save Driver ID
        </Button>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { padding: 12, backgroundColor: "white" },
  input: { marginBottom: 8 },
  label: { marginBottom: 6, color: "#444" }
});
