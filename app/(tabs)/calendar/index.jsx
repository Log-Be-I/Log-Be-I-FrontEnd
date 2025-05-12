import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { format } from "date-fns";

import CalendarBody from "../../../components/calendar/CalendarBody";
import ScheduleComponent from "../../../components/calendar/ScheduleComponent";
import { getAllSchedules } from "../../../api/schedule/scheduleApi";
import { Holidays } from "../../../dummyData/Holidays";

// ✅ 한국 시간 (Asia/Seoul) 기준으로 현재 날짜 가져오기
const getKSTDate = () => {
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60 * 1000;
  const kstTime = utc + 9 * 60 * 60 * 1000; // KST: UTC +9
  console.log("🔥 kstTime:", new Date(kstTime));
  return new Date(kstTime);
};

export default function MyCalendar() { 
  const router = useRouter();
  const { refresh, selectedDate } = useLocalSearchParams();
  const initialDate = getKSTDate();
  console.log("🔥 초기 날짜:", initialDate);

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
      const data = await getAllSchedules(year, month);
      const formatted = {};
      const marks = {};

      // 서버에서 받아온 일정 데이터 처리
      data.data.forEach((item) => {
        const startDate = item.startDateTime.split("T")[0];
        const endDate = item.endDateTime.split("T")[0];
        let currentDate = startDate;

        while (currentDate <= endDate) {
          if (!formatted[currentDate]) formatted[currentDate] = [];
          formatted[currentDate].push({
            id: item.scheduleId,
            title: item.title,
            startDateTime: item.startDateTime,
            endDateTime: item.endDateTime,
            calendarId: item.calendarId,
          });
          marks[currentDate] = {
            ...(marks[currentDate] || {}),
            marked: true,
            dotColor: "#69BAFF",
            originDotColor: "#69BAFF",
          };
          const nextDay = new Date(currentDate);
          nextDay.setDate(nextDay.getDate() + 1);
          currentDate = nextDay.toISOString().split("T")[0];
        }
      });

      // 공휴일 처리
      Object.entries(Holidays).forEach(([date, holiday]) => {
        marks[date] = {
          ...(marks[date] || {}),
          marked: true,
          dotColor: "#FF4B4B",
          originDotColor: "#FF4B4B",
        };
        if (!formatted[date]) formatted[date] = [];
        
        const holidayList = Array.isArray(holiday) ? holiday : [holiday];
        holidayList.forEach(h => {
          formatted[date].push({
            title: h.name,
            startDateTime: `${date}T00:00:00`,
            endDateTime: `${date}T23:59:59`,
            isHoliday: true,
          });
        });
      });

      setAllSchedules(formatted);
      setMarkedDates(marks);
      setSelectedDaySchedules(formatted[format(selected, 'yyyy-MM-dd')] || []);
    } catch (error) {
      console.error("일정 조회 실패:", error);
    }
  };

  // 초기 로딩 및 새로고침 처리
  useEffect(() => {
    const date = refresh ? getKSTDate() : initialDate;
    const selectedDateObj = selectedDate ? new Date(selectedDate) : date;
    setSelected(selectedDateObj);
    
    // 선택된 날짜의 월과 년도로 캘린더 이동
    setCurrentMonth(selectedDateObj.getMonth() + 1);
    setCurrentYear(selectedDateObj.getFullYear());
    
    // 해당 월의 일정을 가져옴
    fetchSchedules(selectedDateObj.getFullYear(), selectedDateObj.getMonth() + 1);
  }, [refresh, selectedDate]);

  // 월 변경 처리
  useEffect(() => {
    fetchSchedules(currentYear, currentMonth);
  }, [currentYear, currentMonth]);

  const handleDayPress = (day) => {
    const newSelected = new Date(day.dateString);
    const newMonth = newSelected.getMonth() + 1;
    const newYear = newSelected.getFullYear();

    // 선택한 날짜가 현재 표시된 달과 다른 경우
    if (newMonth !== currentMonth || newYear !== currentYear) {
      setCurrentMonth(newMonth);
      setCurrentYear(newYear);
      // 새로운 달의 일정을 가져옴
      fetchSchedules(newYear, newMonth).then(() => {
        setSelected(newSelected);
        setSelectedDaySchedules(allSchedules[day.dateString] || []);
      });
    } else {
      setSelected(newSelected);
      setSelectedDaySchedules(allSchedules[day.dateString] || []);
    }
  };

  const handleMonthChange = (date) => {
    const newMonth = date.getMonth() + 1;
    const newYear = date.getFullYear();
    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
    setSelected(null);
    setSelectedDaySchedules([]);
  };

  const handleAddSchedule = () => {
    router.push({
      pathname: "/(tabs)/calendar/addSchedule",
      params: { 
        selectedDate: selected,
        currentMonth: currentMonth,
        currentYear: currentYear
      },
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
