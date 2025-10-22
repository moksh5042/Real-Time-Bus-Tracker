// components/LocationCard.js
import React from "react";
import { View, StyleSheet } from "react-native";
import { Card, Paragraph, Title } from "react-native-paper";

export default function LocationCard({ location }) {
  if (!location) {
    return (
      <Card style={styles.card}>
        <Card.Content>
          <Title>Location</Title>
          <Paragraph>No location yet. Start tracking to get updates.</Paragraph>
        </Card.Content>
      </Card>
    );
  }

  return (
    <Card style={styles.card}>
      <Card.Content>
        <Title>Current Location</Title>
        <Paragraph>Lat: {location.latitude.toFixed(6)}</Paragraph>
        <Paragraph>Lng: {location.longitude.toFixed(6)}</Paragraph>
        <Paragraph>Speed: {(location.speed ?? 0).toFixed(2)} m/s</Paragraph>
        <Paragraph>Accuracy: {Math.round(location.accuracy)} m</Paragraph>
        <Paragraph>Timestamp: {new Date(location.timestamp * 1000).toLocaleString()}</Paragraph>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { marginBottom: 12 }
});
