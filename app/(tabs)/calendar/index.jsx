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

// ✅ 한국 시간 (Asia/Seoul) 기준으로 현재 날짜 가져오기
const getKSTDate = () => {
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  const kstOffset = 9 * 60 * 60000; // KST: UTC +9
  return new Date(utc + kstOffset);
};

export default function MyCalendar() { 
  const router = useRouter();
  const { refresh, selectedDate } = useLocalSearchParams();
  const initialDate = getKSTDate();

  const [selected, setSelected] = useState(
    selectedDate ? new Date(selectedDate) : initialDate
  );
  const [markedDates, setMarkedDates] = useState({});
  const [selectedDaySchedules, setSelectedDaySchedules] = useState([]);
  const [allSchedules, setAllSchedules] = useState({});
  const [currentMonth, setCurrentMonth] = useState(initialDate.getMonth() + 1);
  const [currentYear, setCurrentYear] = useState(initialDate.getFullYear());
// 일정 데이터를 서버에서 가져와 달력에 마킹하고 표시하는 함수
  const fetchSchedules = async (year, month) => {
    try {
      // 서버에 지정된 월의 일정 데이터를 가져온다.
      const data = await getAllSchedules(year, month);
      // 일정 데이터를 저장할 객체들 초기화
      const formatted = {}; // 날짜별 일정 저장
      const marks = {}; // 날짜별 마킹 저장(공휴일 포함)
      // 서버에서 받아온 일정 데이터를 하나씩 처리
      data.data.forEach((item) => {
        const start = item.startDateTime; // KST 시간 그대로 사용
        const end = item.endDateTime;
        // 시작일과 종료일의 날짜만 추출
        const startDate = start.split("T")[0]; // 2025-05-09
        const endDate = end.split("T")[0]; // 2025-05-10
        // 시작일부터 종료일까지 날짜를 증가시키며 저장할 변수
        let currentDate = startDate;

        // 시작일부터 종료일까지 모든 날짜에 일정 추가
        while (currentDate <= endDate) {
          //해당 날짜에 일정 배열이 없으면 새로 생성
          if (!formatted[currentDate]) formatted[currentDate] = [];
          formatted[currentDate].push({
            id: item.scheduleId,
            title: item.title,
            startDateTime: item.startDateTime, // 시작 시간(KST)
            endDateTime: item.endDateTime, // 종료 시간(KST)
            calendarId: item.calendarId,
          });
          // 날짜 마커 설정(표시용)
          marks[currentDate] = {
            ...(marks[currentDate] || {}), // 기존 마커 유지
            marked: true, // 마커 표시
            dotColor: "#69BAFF",
            originDotColor: "#69BAFF",
          };
          // currentDate를 다음 날짜로 증가 (KST 유지)
          const nextDay = new Date(currentDate);
          nextDay.setDate(nextDay.getDate() + 1);
          currentDate = nextDay.toISOString().split("T")[0];
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

      // 처리된 일정 데이터를 상태로 저장
      setAllSchedules(formatted); // 날짜별 일정 목록
      setMarkedDates(marks); // 날짜별 마킹 정보
    // 사용자가 선택한 날짜의 일정 보여주기
    if (selected) {
      const selectedDateString = typeof selected === "string" ? selected : selected.toISOString().split("T")[0];
      setSelectedDaySchedules(formatted[selectedDateString] || []);
    }
    } catch (error) {
      console.error("일정 조회 실패:", error);
    }
  };

  // 새로고침 플래그가 있을 때 일정 다시 불러오기
  useEffect(() => {
    if (refresh) {
      const date = getKSTDate();
      // 선택된 날짜의 월과 년도로 캘린더 이동
      setCurrentMonth(date.getMonth() + 1);
      setCurrentYear(date.getFullYear());
      // 해당 월의 일정 불러오기
      fetchSchedules(date.getFullYear(), date.getMonth() + 1);
      // 선택된 날짜 설정
      setSelected(selectedDate || date.toISOString().split("T")[0]);
    }
  }, [refresh, selectedDate]);

  // 월이 변경될 때마다 일정 다시 불러오기
  useEffect(() => {
    fetchSchedules(currentYear, currentMonth);
  }, [currentYear, currentMonth]);

  // useFocusEffect(
  //   useCallback(() => {
  //     fetchSchedules(currentYear, currentMonth);
  //   }, [currentYear, currentMonth])
  // );

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
    const daySchedules = allSchedules[day.dateString] || [];
  
    // 서버에서 받은 KST 시간 그대로 사용
    setSelectedDaySchedules(daySchedules);
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
