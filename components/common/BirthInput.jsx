// components/BirthInput.jsx
import { View, Pressable, Text, Platform, StyleSheet } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useState } from "react";
import BirthIcon from "../../assets/images/birthDay.svg";

export default function BirthInput({ value, setValue, placeholder = "YYYY-MM-DD" }) {
  const [showPicker, setShowPicker] = useState(false);

  const onChange = (event, selectedDate) => {
    setShowPicker(Platform.OS === "ios"); // iOS는 계속 보여야 함
    if (selectedDate) {
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
      const day = String(selectedDate.getDate()).padStart(2, "0");
      setValue(`${year}-${month}-${day}`);
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
          display="spinner"
          maximumDate={new Date()}
          onChange={onChange}
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
});
