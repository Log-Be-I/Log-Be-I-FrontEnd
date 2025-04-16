import { View, Text, Pressable, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function RecordItem({
  id,
  category,
  categoryInfo,
  time,
  content,
  writeTime,
  isSelectMode,
  isSelected,
  onSelect,
}) {
  return (
    <Pressable
      style={[styles.container, isSelected && styles.selectedContainer]}
      onPress={isSelectMode ? onSelect : undefined}
    >
      <View style={styles.leftSection}>
        <MaterialCommunityIcons
          name={categoryInfo.name}
          size={24}
          color={categoryInfo.color}
        />
      </View>
      <View style={styles.timeSection}>
        <Text style={styles.timeText}>{time}</Text>
      </View>
      <View style={styles.contentSection}>
        <Text style={styles.contentText} numberOfLines={2}>
          {content}
        </Text>
      </View>
      <View style={styles.rightSection}>
        <Text style={styles.writeTimeText}>Created. {writeTime}</Text>
      </View>
      {isSelectMode && (
        <View style={[styles.checkbox, isSelected && styles.checked]}>
          {isSelected && (
            <MaterialCommunityIcons name="check" size={16} color="#FFFFFF" />
          )}
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
    fontSize: 12,
    color: "#666666",
  },
  checkbox: {
    position: "absolute",
    right: 8,
    top: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
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
