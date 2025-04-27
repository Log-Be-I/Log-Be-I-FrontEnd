import React, { useMemo } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { getCategoryById } from "../../constants/CategoryData";

export default function RecordItem({
  record,
  onSelect,
  isSelectMode,
  isSelected,
}) {
  const category = getCategoryById(record.categoryId);

  return (
    <Pressable
      style={[styles.container, isSelected && styles.selectedContainer]}
      onPress={onSelect}
    >
      <View style={styles.leftSection}>
        <MaterialCommunityIcons
          name={category.icon}
          size={24}
          color={category.color}
        />
      </View>
      <View style={styles.timeSection}>
        <Text style={styles.timeText}>{record.record_time}</Text>
      </View>
      <View style={styles.contentSection}>
        <Text style={styles.contentText} numberOfLines={2}>
          {record.content}
        </Text>
      </View>
      <View style={styles.rightSection}>
        <Text style={styles.writeTimeText}>{record.record_date}</Text>
      </View>
      {isSelectMode && (
        <View style={styles.checkboxContainer}>
          <MaterialCommunityIcons
            name={isSelected ? "check-circle" : "circle-outline"}
            size={24}
            color={isSelected ? "#69BAFF" : "#CCCCCC"}
          />
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedContainer: {
    backgroundColor: "#F0F7FF",
  },
  leftSection: {
    marginRight: 12,
  },
  timeSection: {
    marginRight: 12,
  },
  timeText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333333",
  },
  contentSection: {
    flex: 1,
    marginRight: 12,
  },
  contentText: {
    fontSize: 14,
    color: "#333333",
    lineHeight: 20,
  },
  rightSection: {
    alignItems: "flex-end",
  },
  writeTimeText: {
    fontSize: 10,
    color: "#666666",
  },
  checkboxContainer: {
    position: "absolute",
    right: 16,
    top: 16,
  },
});
