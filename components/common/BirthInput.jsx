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
  // const [selectedDate, setSelectedDate] = useState(
  //   value ? new Date(value) : new Date()
  // );

  const onChange = (event, selected) => {
    setShowPicker(false);
    // const currentDate = selected || selectedDate;
    // setShowPicker(Platform.OS === "ios");
    // setSelectedDate(currentDate);
    if (selected) {
      const year = selected.getFullYear();
      const month = String(selected.getMonth() + 1).padStart(2, "0");
      const day = String(selected.getDate()).padStart(2, "0");
      const formattedDate = `${year}-${month}-${day}`;
      console.log("✅ 선택된 날짜:", formattedDate);
      handleValue(formattedDate);
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
          value={value ? new Date(value) : new Date()}
          mode="date"
          display="default"
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
