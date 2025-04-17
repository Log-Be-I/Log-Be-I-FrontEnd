import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { CATEGORIES, CATEGORY_ICONS } from "../../constants/CategoryData";

export default function RecordItem({
  record,
  onSelect,
  isSelectMode,
  isSelected,
}) {
  const categoryInfo = CATEGORIES.find(
    (cat) => cat.category_id === record.category_id
  );
  const iconInfo = CATEGORY_ICONS[categoryInfo?.name];

  return (
    <Pressable
      style={[styles.container, isSelected && styles.selectedContainer]}
      onPress={onSelect}
    >
      <View style={styles.leftSection}>
        <MaterialCommunityIcons
          name={iconInfo?.name}
          size={24}
          color={iconInfo?.color}
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
        <View style={[styles.checkbox, isSelected && styles.checked]}>
          <MaterialCommunityIcons
            name={isSelected ? "check" : ""}
            size={16}
            color="#FFFFFF"
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
  checkbox: {
    position: "absolute",
    left: -5,
    top: -5,
    width: 20,
    height: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#69BAFF",
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },
  checked: {
    backgroundColor: "#69BAFF",
    borderColor: "#69BAFF",
  },
});
