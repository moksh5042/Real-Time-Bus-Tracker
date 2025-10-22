// components/ActivityLog.js
import React from "react";
import { FlatList, View, StyleSheet } from "react-native";
import { Card, Paragraph, Title } from "react-native-paper";

export default function ActivityLog({ items = [] }) {
  return (
    <Card style={styles.card}>
      <Card.Content>
        <Title>Activity Log (last {items.length})</Title>
      </Card.Content>
      <FlatList
        data={items}
        keyExtractor={(item) => (item.timestamp ? item.timestamp.toString() : Math.random().toString())}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Paragraph>Lat: {item.lat.toFixed(5)}, Lng: {item.lng.toFixed(5)}</Paragraph>
            <Paragraph>Speed: {item.speed.toFixed(2)} m/s, Acc: {Math.round(item.accuracy)}m</Paragraph>
            <Paragraph>{new Date(item.timestamp * 1000).toLocaleTimeString()}</Paragraph>
          </View>
        )}
        contentContainerStyle={{ padding: 12 }}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
      />
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { marginBottom: 12 },
  row: { paddingVertical: 6 }
});
