import React from "react";
import { View, Text, Switch, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

export default function AllDayToggle({ value, onValueChange }) {
  return (
    <View style={styles.container}>
      <Icon name="access-time" size={20} color="#666" />
      <Text style={styles.text}>하루종일</Text>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: "#767577", true: "#69BAFF" }}
        thumbColor={value ? "#fff" : "#f4f3f4"}
        ios_backgroundColor="#767577"
        style={{ transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }] }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginTop: 8,
    marginBottom: 8,
  },
  text: {
    marginLeft: 8,
    marginRight: 8,
    color: "#666",
    fontSize: 14,
  },
});
