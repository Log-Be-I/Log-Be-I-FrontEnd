// components/BirthInput.jsx
import { View, Pressable, Text, Platform, StyleSheet } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useState } from "react";
import BirthIcon from "../../assets/images/birthDay.svg";

export default function BirthInput({
  value,
  handleValue,
  placeholder = "YYYY-MM-DD",
}) {
  const [showPicker, setShowPicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(
    value ? new Date(value) : new Date()
  );

  const onChange = (event, selected) => {
    const currentDate = selected || selectedDate;
    setShowPicker(Platform.OS === "ios");
    setSelectedDate(currentDate);

    if (selected) {
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, "0");
      const day = String(currentDate.getDate()).padStart(2, "0");
      handleValue(`${year}-${month}-${day}`);
    }
  };

  return (
    <View>
      <Pressable onPress={() => setShowPicker(true)} style={styles.container}>
        <View style={styles.icon}>
          <BirthIcon width={20} height={20} />
        </View>
        <Text style={[styles.text, { color: value ? "#333" : "#aaa" }]}>
          {value || placeholder}
        </Text>
      </Pressable>

      {showPicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="spinner"
          maximumDate={new Date()}
          onChange={onChange}
          style={styles.datePicker}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    paddingHorizontal: 12,
    paddingVertical: 19,
    borderRadius: 8,
    marginBottom: 10,
  },
  icon: {
    marginRight: 15,
  },
  text: {
    fontSize: 14,
    color: "#333",
    fontFamily: "Pretendard",
  },
  datePicker: {
    width: Platform.OS === "ios" ? "100%" : undefined,
  },
});
