import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { format, isSameMonth, isSameDay } from "date-fns";
import { Holidays } from "../../dummyData/Holidays";

export default function CalendarDay({
  date,
  currentDate,
  selectedDate,
  onSelectDate,
  schedules,
  markedDates = {},
}) {
  if (!date) return <View style={styles.dayContainer} />;

  const dateString = format(date, "yyyy-MM-dd");
  // UTC기준이 아니라 한국 시간 기준으로 판별
  const isToday = isSameDay(date, new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Seoul" })));
  const isSelected = isSameDay(date, selectedDate);
  const isCurrentMonth = isSameMonth(date, currentDate);
  const isSunday = date.getDay() === 0;
  const isSaturday = date.getDay() === 6;
  const isHoliday = !!Holidays[dateString];
  const marked = markedDates[dateString];

  const getDayColor = () => {
    if (!isCurrentMonth) return "#D1D5DB"; // 이전/다음달 회색 처리
    if (isSelected) return "#fff";
    if (isToday) return "#69BAFF";
    if (isHoliday || isSunday) return "#FF4B4B";
    if (isSaturday) return "#4B75FF";
    return "#000";
  };

  const getDotColor = () => {
    if (!marked?.marked) return "transparent";
    if (isSelected) return "white";
    return marked.dotColor || "#69BAFF";
  };

  return (
    <TouchableOpacity
      style={styles.dayContainer}
      onPress={() => onSelectDate(date)}
    >
      <View style={styles.dayContent}>
        {isSelected && <View style={styles.selectedCircle} />}
        <Text style={[styles.dayText, { color: getDayColor() }]}>
          {format(date, "d")}
        </Text>
        <View style={styles.dotWrapper}>
          {getDotColor() !== "transparent" && (
            <View style={[styles.dot, { backgroundColor: getDotColor() }]} />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  dayContainer: {
    flex: 1,
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  dayContent: {
    alignItems: "center",
    justifyContent: "center",
  },
  selectedCircle: {
    position: "absolute",
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#69BAFF",
  },
  dayText: {
    fontSize: 14,
    textAlign: "center",
  },
  dotWrapper: {
    height: 6,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 2,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
});
