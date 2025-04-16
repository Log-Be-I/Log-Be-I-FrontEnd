import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function TimePickerInput({ value, onChange, isEditing }) {
  const [showTimePicker, setShowTimePicker] = useState(false);

  const handleTimeChange = (event, selectedTime) => {
    setShowTimePicker(false);
    if (selectedTime) {
      const formattedTime = selectedTime.toLocaleTimeString("ko-KR", {
        hour: "2-digit",
        minute: "2-digit",
      });
      onChange(formattedTime);
    }
  };

  return (
    <View>
      <Pressable
        style={styles.timeContainer}
        onPress={() => isEditing && setShowTimePicker(true)}
      >
        <MaterialCommunityIcons
          name="clock-outline"
          size={24}
          color={isEditing ? "#69BAFF" : "#666666"}
        />
        <Text style={styles.timeText}>{value}</Text>
      </Pressable>

      {showTimePicker && (
        <DateTimePicker
          value={new Date(`2000-01-01T${value}`)}
          mode="time"
          is24Hour={true}
          display="spinner"
          onChange={handleTimeChange}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  timeText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333333",
  },
});
