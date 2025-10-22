// components/StatsGrid.js
import React from "react";
import { View, StyleSheet } from "react-native";
import { Card, Title, Paragraph } from "react-native-paper";

function metersToKm(m) {
  return (m / 1000).toFixed(2);
}

function secsToHMS(s) {
  const hrs = Math.floor(s / 3600);
  const mins = Math.floor((s % 3600) / 60);
  const secs = s % 60;
  return `${hrs}h ${mins}m ${secs}s`;
}

export default function StatsGrid({ session }) {
  if (!session) {
    return null;
  }

  return (
    <View style={styles.row}>
      <Card style={styles.card}>
        <Card.Content>
          <Title>Distance</Title>
          <Paragraph>{metersToKm(session.distanceMeters || 0)} km</Paragraph>
        </Card.Content>
      </Card>
      <Card style={styles.card}>
        <Card.Content>
          <Title>Avg Speed</Title>
          <Paragraph>{(session.avgSpeed || 0).toFixed(2)} m/s</Paragraph>
        </Card.Content>
      </Card>
      <Card style={styles.card}>
        <Card.Content>
          <Title>Duration</Title>
          <Paragraph>{secsToHMS(session.durationSeconds || 0)}</Paragraph>
        </Card.Content>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 12 },
  card: { flex: 1, marginHorizontal: 4 }
});
