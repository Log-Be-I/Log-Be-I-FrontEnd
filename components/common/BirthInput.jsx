// components/BirthInput.jsx
import { View, Pressable, Text, Platform, StyleSheet } from "react-native";
import DateTimePicker from "react-native-date-picker";
import { useState } from "react";
import BirthIcon from "../../assets/images/birthDay.svg";

export default function BirthInput({ value, setValue, placeholder = "YYYY-MM-DD" }) {
  const [showPicker, setShowPicker] = useState(false);

  const formatDate = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  const getValidDate = (value) => {
    const date = new Date(value);
    return isNaN(date.getTime()) ? new Date() : date;
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

      {Platform.OS === 'android' || Platform.OS === 'ios' ? (
        <DateTimePicker
          modal
          open={showPicker}
          mode="date"
          locale="ko"
          maximumDate={new Date()}
          date={getValidDate(value)}
          onConfirm={(date) => {
            setValue(formatDate(date));
            setShowPicker(false);
          }}
          onCancel={() => setShowPicker(false)}
        />
      ) : (<Text>생일선택은 실제 앱에서 가능합니다.</Text>)}
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
