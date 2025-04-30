import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet, Platform } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function RecordTimePickerInput({ value, onChange, isEditing }) {
  const [showTimePicker, setShowTimePicker] = useState(false);

  const handleTimeChange = (event, selectedTime) => {
    if (Platform.OS === "android") {
      setShowTimePicker(false);
    }

    if (selectedTime && event.type !== "dismissed") {
      const koreanTime = new Date(selectedTime.getTime());
      const formattedTime = koreanTime.toLocaleTimeString("ko-KR", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
      onChange(formattedTime);
    }
  };

  const parseTimeString = (timeStr) => {
    const [hours, minutes] = timeStr.split(":").map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
  };

  return (
    <View style={styles.container}>
      <Pressable
        style={styles.timeContainer}
        onPress={() => isEditing && setShowTimePicker(true)}
      >
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons
            name="clock-outline"
            size={24}
            color={isEditing ? "#69BAFF" : "#666666"}
          />
        </View>
        <View style={styles.textContainer}>
          <Text
            style={[styles.timeText, !isEditing && styles.timeTextDisabled]}
          >
            {value}
          </Text>
        </View>
      </Pressable>

      {showTimePicker && (
        <DateTimePicker
          value={parseTimeString(value)}
          mode="time"
          is24Hour={true}
          display={Platform.OS === "ios" ? "spinner" : "spinner"}
          onChange={handleTimeChange}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  textContainer: {
    justifyContent: "center",
  },
  timeText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333333",
  },
  timeTextDisabled: {
    color: "#666666",
  },
});
