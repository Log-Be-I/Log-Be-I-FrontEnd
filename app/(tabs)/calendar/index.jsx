import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { format } from "date-fns";

import CalendarBody from "../../../components/calendar/CalendarBody";
import ScheduleComponent from "../../../components/calendar/ScheduleComponent";
import { getAllSchedules } from "../../../api/schedule/scheduleApi";
import { Holidays } from "../../../dummyData/Holidays";

export default function MyCalendar() {
  const router = useRouter();
  const { refresh, selectedDate, targetMonth, targetYear } =
    useLocalSearchParams();
  const [selected, setSelected] = useState(
    selectedDate || new Date().toISOString().split("T")[0]
  );
  const [markedDates, setMarkedDates] = useState({});
  const [selectedDaySchedules, setSelectedDaySchedules] = useState([]);
  const [allSchedules, setAllSchedules] = useState({});
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const fetchSchedules = async (year, month) => {
    try {
      const data = await getAllSchedules(year, month);
      const formatted = {};
      const marks = {};

      data.forEach((item) => {
        const start = new Date(item.startDateTime);
        const end = new Date(item.endDateTime);
        const current = new Date(start);

        // 시작일부터 종료일까지 모든 날짜에 마크 추가
        while (current <= end) {
          const dateKey = current.toISOString().split("T")[0];
          if (!formatted[dateKey]) formatted[dateKey] = [];
          formatted[dateKey].push({
            id: item.scheduleId,
            title: item.title,
            startDateTime: item.startDateTime,
            endDateTime: item.endDateTime,
            calendarId: item.calendarId,
          });
          marks[dateKey] = {
            ...(marks[dateKey] || {}),
            marked: true,
            dotColor: "#69BAFF",
            originDotColor: "#69BAFF",
          };
          current.setDate(current.getDate() + 1);
        }
      });

      // 공휴일 마커 추가
      Object.keys(Holidays).forEach((date) => {
        marks[date] = {
          ...(marks[date] || {}),
          marked: true,
          dotColor: "#FF4B4B",
          originDotColor: "#FF4B4B",
        };
        if (!formatted[date]) formatted[date] = [];
        formatted[date].push({
          title: Holidays[date].name,
          startDateTime: `${date}T00:00:00`,
          endDateTime: `${date}T23:59:59`,
          isHoliday: true,
        });
      });

      setAllSchedules((prev) => {
        const merged = { ...prev, ...formatted };
        return merged;
      });

      setMarkedDates((prev) => {
        const merged = { ...prev, ...marks };
        return merged;
      });

      setSelectedDaySchedules(formatted[selected] || []);
    } catch (error) {
      console.error("일정 조회 실패:", error);
    }
  };

  // 새로고침 플래그가 있을 때 일정 다시 불러오기
  useEffect(() => {
    if (refresh) {
      const date = new Date(selectedDate);
      // 선택된 날짜의 월과 년도로 캘린더 이동
      setCurrentMonth(date.getMonth() + 1);
      setCurrentYear(date.getFullYear());
      // 해당 월의 일정 불러오기
      fetchSchedules(date.getFullYear(), date.getMonth() + 1);
      // 선택된 날짜 설정
      setSelected(selectedDate);
    }
  }, [refresh, selectedDate]);

  // 월이 변경될 때마다 일정 다시 불러오기
  useEffect(() => {
    fetchSchedules(currentYear, currentMonth);
  }, [currentYear, currentMonth]);

  useFocusEffect(
    useCallback(() => {
      fetchSchedules(currentYear, currentMonth);
    }, [currentYear, currentMonth])
  );

  const handleMonthChange = (date) => {
    const newMonth = date.getMonth() + 1;
    const newYear = date.getFullYear();
    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
    // 달이 변경될 때 선택된 날짜와 일정 초기화
    setSelected(null);
    setSelectedDaySchedules([]);
  };

  const handleDayPress = (day) => {
    setSelected(day.dateString);
    setSelectedDaySchedules(allSchedules[day.dateString] || []);
  };

  const handleAddSchedule = () => {
    router.push({
      pathname: "/(tabs)/calendar/addSchedule",
      params: { selectedDate: selected },
    });
  };

  const handleSchedulePress = (schedule) => {
    router.push({
      pathname: "/(tabs)/calendar/editSchedule",
      params: { schedule: JSON.stringify(schedule) },
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.calendarWrapper}>
        <CalendarBody
          selected={selected}
          onDayPress={handleDayPress}
          markedDates={markedDates}
          onMonthChange={handleMonthChange}
          currentMonth={currentMonth}
          currentYear={currentYear}
        />
      </View>

      <View style={styles.scheduleWrapper}>
        {/* <SafeAreaView style={{ flex: 1, backgroundColor: "white" }} /> */}
        <ScheduleComponent
          schedules={selectedDaySchedules}
          onPress={handleSchedulePress}
          selectedDate={selected}
        />
      </View>

      <TouchableOpacity style={styles.addButton} onPress={handleAddSchedule}>
        <Icon name="add" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white" },
  calendarWrapper: {
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
    paddingBottom: 10,
  },
  scheduleWrapper: {
    flex: 1,
    paddingHorizontal: 10,
  },
  scheduleScrollView: {
    flex: 1,
  },
  scheduleContent: {
    paddingBottom: 60, // 스크롤 뷰의 bottom이 60
  },
  addButton: {
    position: "absolute",
    right: 20,
    bottom: 70,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#4A90E2",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});
