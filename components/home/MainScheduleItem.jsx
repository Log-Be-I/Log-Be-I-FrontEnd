import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import Text from "../common/Text";

export default function MainScheduleItem({
  title,
  description,
  startTime,
  endTime,
  onPress,
}) {
  return (
    <Pressable onPress={onPress} style={styles.container}>
      <View style={styles.content}>
        <Text variant="medium" size={16} color="#333">
          {title}
        </Text>
        <Text
          variant="regular"
          size={14}
          color="#666"
          style={styles.description}
        >
          {description}
        </Text>
      </View>
      <Text variant="regular" size={14} color="#666">
        {startTime} - {endTime}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#F5F9FF",
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  content: {
    flex: 1,
    gap: 4,
  },
  description: {
    opacity: 0.8,
  },
});
