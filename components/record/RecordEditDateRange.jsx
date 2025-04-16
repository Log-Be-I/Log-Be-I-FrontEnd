import React, { useState } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import CalendarPicker from "react-native-calendar-picker";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { MaterialIcons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

const RecordEditDateRange = ({ date, onDateChange }) => {
  const [selectedDate, setSelectedDate] = useState(date);

  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
    onDateChange(newDate);
  };

  return (
    <View style={styles.container}>
      <CalendarPicker
        startFromMonday={false}
        allowRangeSelection={false}
        selectedStartDate={selectedDate}
        onDateChange={handleDateChange}
        width={width * 0.9}
        todayBackgroundColor="#e6e6e6"
        selectedDayColor="#2196F3"
        selectedDayTextColor="#FFFFFF"
        textStyle={{
          fontFamily: "System",
          color: "#000000",
        }}
        todayTextStyle={{
          fontWeight: "bold",
        }}
        monthTitleStyle={{
          fontFamily: "System",
          fontSize: 16,
          fontWeight: "bold",
        }}
        yearTitleStyle={{
          fontFamily: "System",
          fontSize: 16,
          fontWeight: "bold",
        }}
        previousTitle="이전"
        nextTitle="다음"
        previousTitleStyle={{
          fontFamily: "System",
          fontSize: 14,
        }}
        nextTitleStyle={{
          fontFamily: "System",
          fontSize: 14,
        }}
        weekdays={["일", "월", "화", "수", "목", "금", "토"]}
        months={[
          "1월",
          "2월",
          "3월",
          "4월",
          "5월",
          "6월",
          "7월",
          "8월",
          "9월",
          "10월",
          "11월",
          "12월",
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 12,
  },
});

export default RecordEditDateRange;
