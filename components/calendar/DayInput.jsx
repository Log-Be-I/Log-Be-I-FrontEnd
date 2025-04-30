import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import TimePicker from "./TimePicker";

export default function DayInput({
  label,
  date,
  onDateChange,
  onPressDate,
  isAllDay,
  isStart, // ✅ 추가: 시작/종료 여부 구분을 위해
}) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity onPress={onPressDate} style={styles.dateButton}>
        <Text style={styles.dateText}>
          {format(date, "MM월 dd일 (E)", { locale: ko })}
        </Text>
      </TouchableOpacity>
      <View style={styles.timePickerContainer}>
        <TimePicker
          isStart={isStart} // ✅ 시작이면 true, 종료면 false
          value={date} // ✅ props로 받은 date
          onChange={onDateChange} // ✅ props로 받은 날짜 변경 함수
          isAllDay={isAllDay}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    alignItems: "center",
  },
  label: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  dateButton: {
    paddingVertical: 6,
  },
  dateText: {
    fontSize: 16,
    color: "#032B77",
  },
  timePickerContainer: {
    marginTop: 16,
  },
});
