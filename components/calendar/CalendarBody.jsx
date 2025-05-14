import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
} from "date-fns";
import CalendarDay from "./CalendarDay";

export default function CalendarBody({
  selected,
  onDayPress,
  markedDates = {}, // ✅ 받음
  onMonthChange, // 월 변경 이벤트 핸들러 추가
  currentMonth,
  currentYear,
}) {
  const [currentDate, setCurrentDate] = useState(
    new Date(currentYear, currentMonth - 1)
  );

  const onPrevMonth = () => {
    const newDate = subMonths(currentDate, 1);
    setCurrentDate(newDate);
    onMonthChange?.(newDate);
  };

  const onNextMonth = () => {
    const newDate = addMonths(currentDate, 1);
    setCurrentDate(newDate);
    onMonthChange?.(newDate);
  };

  // currentMonth나 currentYear가 변경되면 currentDate 업데이트
  useEffect(() => {
    setCurrentDate(new Date(currentYear, currentMonth - 1));
  }, [currentMonth, currentYear]);

  const getDaysInMonth = () => {
    const start = startOfMonth(currentDate);
    const end = endOfMonth(currentDate);
    return eachDayOfInterval({ start, end });
  };

  const handleSelectDate = (date) => {
    onDayPress?.({ dateString: format(date, "yyyy-MM-dd") });
    if (!isSameMonth(date, currentDate)) {
      setCurrentDate(date);
    }
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity onPress={onPrevMonth}>
        <Text style={[styles.headerButton, { color: "#69BAFF" }]}>{"<"}</Text>
      </TouchableOpacity>
      <Text style={[styles.headerTitle, { color: "#5B75B1" }]}>
        {format(currentDate, "yyyy년 MM월")}
      </Text>
      <TouchableOpacity onPress={onNextMonth}>
        <Text style={[styles.headerButton, { color: "#69BAFF" }]}>{">"}</Text>
      </TouchableOpacity>
    </View>
  );

  const renderDays = () => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return (
      <View style={styles.daysRow}>
        {days.map((day, index) => (
          <Text
            key={day}
            style={[
              styles.dayLabel,
              index === 0 && styles.sundayLabel,
              index === 6 && styles.saturdayLabel,
            ]}
          >
            {day}
          </Text>
        ))}
      </View>
    );
  };

  const renderCalendar = () => {
    const days = getDaysInMonth();
    const firstDayOfMonth = startOfMonth(currentDate).getDay();
    const weeks = [];
    let week = new Array(7).fill(null);

    for (let i = 0; i < firstDayOfMonth; i++) {
      week[i] = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        -firstDayOfMonth + i + 1
      );
    }

    days.forEach((day, index) => {
      const weekDay = (firstDayOfMonth + index) % 7;
      week[weekDay] = day;
      if (weekDay === 6) {
        weeks.push([...week]);
        week = new Array(7).fill(null);
      }
    });

    // 마지막 주 채우기 - 다음달 날짜로
    if (week.some((day) => day === null)) {
      let nextMonthDay = 1;
      for (let i = 0; i < 7; i++) {
        if (!week[i]) {
          week[i] = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth() + 1,
            nextMonthDay++
          );
        }
      }
      // 주 전체가 다음달인 경우 렌더링 제외
      const allDaysNextMonth = week.every(
        (day) => day.getMonth() !== currentDate.getMonth()
      );

      if (!allDaysNextMonth) {
        weeks.push(week);
      }
    }

    return weeks.map((week, weekIdx) => (
      <View key={weekIdx} style={styles.week}>
        {week.map((day, dayIdx) => (
          <CalendarDay
            key={dayIdx}
            date={day}
            selectedDate={selected}
            currentDate={currentDate}
            onSelectDate={handleSelectDate}
            markedDates={markedDates} //  넘김
          />
        ))}
      </View>
    ));
  };

  return (
    <View style={styles.container}>
      {renderHeader()}
      {renderDays()}
      {renderCalendar()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: "#fff", padding: 10 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerButton: { fontSize: 20, padding: 10 },
  headerTitle: { fontSize: 18, fontWeight: "bold" },
  daysRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  dayLabel: { flex: 1, textAlign: "center", fontSize: 14 },
  sundayLabel: { color: "red" },
  saturdayLabel: { color: "blue" },
  week: { flexDirection: "row", justifyContent: "space-around" },
});
