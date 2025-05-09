import React, { useState, useEffect } from "react";
import { View, StyleSheet, Pressable, Modal } from "react-native";
import { Calendar } from "react-native-calendars";
import Icon from "react-native-vector-icons/Ionicons";
import DayInput from "./DayInput";

export default function DateRangeSelector({
  startDate,
  endDate,
  onDateRangeChange,
  disabled,
  onChange,
  onCalendarOpen,
  isAllDay,
}) {
  const [startedDate, setStartedDate] = useState(new Date(startDate));
  const [endedDate, setEndedDate] = useState(new Date(endDate));
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [markedDates, setMarkedDates] = useState({});
  const [dateType, setDateType] = useState(null);

  // ✅ 하루종일 상태가 변경될 때 날짜와 시간 업데이트
  useEffect(() => {
    if (isAllDay) {
      const start = new Date(startedDate);
      start.setHours(0, 0, 0, 0);
      const end = new Date(startedDate);
      end.setHours(23, 50, 0, 0);

      setStartedDate(start);
      setEndedDate(end);
      updateMarkedDates(start, end);
      onDateRangeChange(start, end);
    }
  }, [isAllDay]);

  const updateMarkedDates = (start, end) => {
    const marks = {};
    // 한국시간 (UTC+9)으로 문자열 변환
    const startStr = start.toISOString().split("T")[0];
    const endStr = end.toISOString().split("T")[0];

    const currentDate = new Date(start);
    while (currentDate <= end) {
      const dateStr = currentDate.toISOString().split("T")[0];
      marks[dateStr] = {
        marked: true,
        dotColor: "#69BAFF",
      };
      currentDate.setDate(currentDate.getDate() + 1);
    }

    marks[startStr] = {
      ...marks[startStr],
      selected: true,
      selectedColor: "#69BAFF",
    };
    marks[endStr] = {
      ...marks[endStr],
      selected: true,
      selectedColor: "#69BAFF",
    };

    setMarkedDates(marks);
  };

  const handleDateSelect = (day) => {
    const selectedDateTime = new Date(day.dateString);

    if (dateType === "start") {
      selectedDateTime.setHours(startedDate.getHours());
      selectedDateTime.setMinutes(startedDate.getMinutes());
      setStartedDate(selectedDateTime);

      if (selectedDateTime > endedDate) {
        setEndedDate(selectedDateTime);
      }
      const newEnd =
        selectedDateTime > endedDate ? selectedDateTime : endedDate;
      updateMarkedDates(selectedDateTime, newEnd);
      onDateRangeChange(selectedDateTime, newEnd);
    } else if (dateType === "end") {
      selectedDateTime.setHours(endedDate.getHours());
      selectedDateTime.setMinutes(endedDate.getMinutes());

      if (selectedDateTime >= startedDate) {
        setEndedDate(selectedDateTime);
        updateMarkedDates(startedDate, selectedDateTime);
        onDateRangeChange(startedDate, selectedDateTime);
      }
    }
    setShowCalendarModal(false);
    if (onChange) onChange();
  };

  const handleStartDatePress = () => {
    setDateType("start");
    setShowCalendarModal(true);
    updateMarkedDates(startedDate, endedDate);
    if (onCalendarOpen) onCalendarOpen();
  };

  const handleEndDatePress = () => {
    setDateType("end");
    setShowCalendarModal(true);
    updateMarkedDates(startedDate, endedDate);
    if (onCalendarOpen) onCalendarOpen();
  };

  const calculateEndDateTime = (startDate) => {
    const newEnd = new Date(startDate);
    const startHour = newEnd.getHours();
    const startMinute = newEnd.getMinutes();
    // 23시일 경우 다음날로 넘어가되 , 분(minute) 유지
    // 만약 날짜가 넘어가면 다음날로 처리
  if (startHour === 23) {
    newEnd.setDate(newEnd.getDate() + 1);
    newEnd.setHours(0, startMinute, 0, 0);
  } else {
    newEnd.setHours(startHour + 1);
    newEnd.setMinutes(startMinute);
  }
  
  return newEnd;
};

  const handleTimeChange = (date, isStart) => {
    if (isAllDay) {
      // 하루종일이면 시간을 강제로 설정
      const newDate = new Date(date);
      if (isStart) {
        newDate.setHours(0, 0, 0, 0);
        setStartedDate(newDate);
        updateMarkedDates(newDate, endedDate);
        onDateRangeChange(newDate, endedDate);
      } else {
        newDate.setHours(23, 50, 0, 0);
        setEndedDate(newDate);
        updateMarkedDates(startedDate, newDate);
        onDateRangeChange(startedDate, newDate);
      }
    } else {
      // 하루종일이 아니면 일반적인 시간 변경
      if (isStart) {
        // 시작 시간을 설정할 때 종료 시간을 자동으로 +1 시간으로 설정
        const newEndDate = calculateEndDateTime(date);
        setStartedDate(date);
        setEndedDate(newEndDate);
        updateMarkedDates(date, newEndDate);
        onDateRangeChange(date, newEndDate);
      } else {
        setEndedDate(date);
        updateMarkedDates(startedDate, date);
        onDateRangeChange(startedDate, date);
      }
    }

    if (onChange) onChange();
  };

  return (
    <View style={styles.container}>
      <View style={styles.dateRow}>
        <DayInput
          label="시작"
          date={startedDate}
          onDateChange={(date) => {
            handleTimeChange(date, true);
          }}
          onPressDate={handleStartDatePress}
          isAllDay={isAllDay}
          isStart={true}
        />
        <Icon
          name="arrow-forward"
          size={24}
          color="#666"
          style={styles.arrow}
        />
        <DayInput
          label="종료"
          date={endedDate}
          onDateChange={(date) => handleTimeChange(date, false)}
          onPressDate={handleEndDatePress}
          isAllDay={isAllDay}
          isStart={false}
        />
      </View>

      {showCalendarModal && (
        <Modal
          visible={showCalendarModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowCalendarModal(false)}
        >
          <Pressable
            style={styles.modalOverlay}
            onPress={() => setShowCalendarModal(false)}
          >
            <Pressable style={styles.calendarWrapper} onPress={() => {}}>
              <Calendar
                current={
                  dateType === "start"
                    ? startedDate.toISOString()
                    : endedDate.toISOString()
                }
                minDate={
                  dateType === "end"
                    ? startedDate.toISOString().split("T")[0]
                    : undefined
                }
                onDayPress={handleDateSelect}
                markedDates={markedDates}
                style={styles.calendar}
                theme={{
                  calendarBackground: "white",
                  selectedDayBackgroundColor: "#69BAFF",
                  todayTextColor: "#2563ED",
                }}
                monthFormat={"yyyy년 MM월"}
              />
            </Pressable>
          </Pressable>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
    marginTop: 16,
    marginBottom: 24,
  },
  arrow: {
    marginHorizontal: 12,
    marginTop: 36,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  calendarWrapper: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 12,
  },
  calendar: {
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 12,
    height: 380,
  },
});
