import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  Animated,
} from "react-native";
import CalendarPicker from "react-native-calendar-picker";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import RecordButton from "../common/RecordButton";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

const QUICK_SELECTIONS = [
  { label: "오늘", days: 0 },
  { label: "이번 주", days: 7 },
  { label: "이번 달", days: 30 },
];

export default function RecordDateRange({ onRangeChange, isSelectMode }) {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [selectedRange, setSelectedRange] = useState(null);
  const [tempStartDate, setTempStartDate] = useState(null);
  const [tempEndDate, setTempEndDate] = useState(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [activeQuickSelect, setActiveQuickSelect] = useState("today");
  const [showQuickSelectModal, setShowQuickSelectModal] = useState(false);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  const formatDate = (date) => {
    if (!date) return "";

    // Date 객체인 경우 KST로 변환
    const d = new Date(date);
    const utc = d.getTime() + d.getTimezoneOffset() * 60000;
    const kstDate = new Date(utc + 9 * 60 * 60 * 1000);

    const year = kstDate.getFullYear();
    const month = String(kstDate.getMonth() + 1).padStart(2, "0");
    const day = String(kstDate.getDate()).padStart(2, "0");

    return `${year}.${month}.${day}`;
  };

  const handleDateChange = (date, type) => {
    if (type === "END_DATE") {
      setTempEndDate(date ? new Date(date) : null);
    } else {
      setTempStartDate(date ? new Date(date) : null);
      if (!date) {
        setTempEndDate(null);
      }
    }
  };

  const handleConfirm = () => {
    if (tempStartDate) {
      setStartDate(tempStartDate);
      if (tempEndDate) {
        setEndDate(tempEndDate);
        onRangeChange({
          startDate: tempStartDate,
          endDate: tempEndDate,
        });
      } else {
        setEndDate(tempStartDate);
        onRangeChange({
          startDate: tempStartDate,
          endDate: tempStartDate,
        });
      }

      // 날짜 범위에 따라 activeQuickSelect 설정
      if (isToday(tempStartDate) && (!tempEndDate || isToday(tempEndDate))) {
        setActiveQuickSelect("today");
      } else if (isThisWeek(tempStartDate, tempEndDate || tempStartDate)) {
        setActiveQuickSelect("week");
      } else if (isThisMonth(tempStartDate, tempEndDate || tempStartDate)) {
        setActiveQuickSelect("month");
      } else {
        setActiveQuickSelect(null);
      }
    }
    setShowModal(false);
  };

  const handleQuickSelect = (days) => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - days);

    setStartDate(start);
    setEndDate(end);
    setSelectedRange(days);

    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0.5,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();

    onRangeChange({ startDate: start, endDate: end });
  };

  const handleModalOpen = () => {
    setTempStartDate(startDate);
    setTempEndDate(endDate);
    setShowModal(true);
  };

  const handleStartDateChange = (event, selectedDate) => {
    setShowStartPicker(false);
    if (selectedDate) {
      setStartDate(selectedDate);
      setTimeout(() => {
        setShowEndPicker(true);
      }, 300);
    }
  };

  const handleEndDateChange = (event, selectedDate) => {
    setShowEndPicker(false);
    if (selectedDate) {
      setEndDate(selectedDate);
      onRangeChange({
        startDate: startDate,
        endDate: selectedDate,
      });
    }
  };

  const handleToday = () => {
    const today = new Date();
    setStartDate(today);
    setEndDate(today);
    setActiveQuickSelect("today");
    setTempStartDate(today);
    setTempEndDate(today);
    onRangeChange({
      startDate: today,
      endDate: today,
    });
    setShowModal(false);
  };

  const handleThisWeek = () => {
    const today = new Date();
    const firstDay = new Date(today);
    firstDay.setDate(today.getDate() - today.getDay());
    const lastDay = new Date(firstDay);
    lastDay.setDate(firstDay.getDate() + 6);

    setStartDate(firstDay);
    setEndDate(lastDay);
    setActiveQuickSelect("week");
    setTempStartDate(firstDay);
    setTempEndDate(lastDay);
    onRangeChange({
      startDate: firstDay,
      endDate: lastDay,
    });
    setShowModal(false);
  };

  const handleThisMonth = () => {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    setStartDate(firstDay);
    setEndDate(lastDay);
    setActiveQuickSelect("month");
    setTempStartDate(firstDay);
    setTempEndDate(lastDay);
    onRangeChange({
      startDate: firstDay,
      endDate: lastDay,
    });
    setShowModal(false);
  };

  const isToday = (date) => {
    if (!date) return false;
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const isThisWeek = (start, end) => {
    if (!start || !end) return false;
    const today = new Date();
    const firstDayOfWeek = new Date(today);
    firstDayOfWeek.setDate(today.getDate() - today.getDay());
    firstDayOfWeek.setHours(0, 0, 0, 0);
    const lastDayOfWeek = new Date(firstDayOfWeek);
    lastDayOfWeek.setDate(firstDayOfWeek.getDate() + 6);
    lastDayOfWeek.setHours(23, 59, 59, 999);

    const startTime = new Date(start).setHours(0, 0, 0, 0);
    const endTime = new Date(end).setHours(23, 59, 59, 999);

    return (
      startTime === firstDayOfWeek.getTime() &&
      endTime === lastDayOfWeek.getTime()
    );
  };

  const isThisMonth = (start, end) => {
    if (!start || !end) return false;
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    firstDayOfMonth.setHours(0, 0, 0, 0);
    const lastDayOfMonth = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      0
    );
    lastDayOfMonth.setHours(23, 59, 59, 999);

    const startTime = new Date(start).setHours(0, 0, 0, 0);
    const endTime = new Date(end).setHours(23, 59, 59, 999);

    return (
      startTime === firstDayOfMonth.getTime() &&
      endTime === lastDayOfMonth.getTime()
    );
  };

  useEffect(() => {
    const today = new Date();
    setStartDate(today);
    setEndDate(today);
    setTempStartDate(today);
    setTempEndDate(today);
    setActiveQuickSelect("today");
    onRangeChange({
      startDate: today,
      endDate: today,
    });
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <View style={styles.dateRangeContainer}>
        <MaterialCommunityIcons
          name="calendar"
          size={32}
          color={isSelectMode ? "#CCCCCC" : "#69BAFF"}
          style={styles.calendarIcon}
        />
        <Pressable
          style={[
            styles.dateRangeButton,
            isSelectMode && styles.dateRangeButtonDisabled,
          ]}
          onPress={isSelectMode ? null : () => setShowModal(true)}
        >
          <View style={styles.dateTextContainer}>
            <Text
              style={[styles.dateText, isSelectMode && styles.dateTextDisabled]}
            >
              {formatDate(startDate)}
            </Text>
            <Text
              style={[
                styles.separator,
                isSelectMode && styles.dateTextDisabled,
              ]}
            >
              ~
            </Text>
            <Text
              style={[styles.dateText, isSelectMode && styles.dateTextDisabled]}
            >
              {formatDate(endDate)}
            </Text>
          </View>
        </Pressable>
      </View>

      <Modal
        transparent={true}
        visible={showModal && !isSelectMode}
        animationType="fade"
        onRequestClose={() => setShowModal(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowModal(false)}
        >
          <View
            style={styles.modalContent}
            onStartShouldSetResponder={() => true}
          >
            <View style={styles.calendarHeader}>
              <Text style={styles.calendarTitle}>날짜 선택</Text>
              <View style={styles.quickSelectContainer}>
                <RecordButton
                  label="오늘"
                  onPress={handleToday}
                  variant={
                    activeQuickSelect === "today" ? "primary" : "default"
                  }
                  size="small"
                />
                <RecordButton
                  label="이번 주"
                  onPress={handleThisWeek}
                  variant={activeQuickSelect === "week" ? "primary" : "default"}
                  size="small"
                />
                <RecordButton
                  label="이번 달"
                  onPress={handleThisMonth}
                  variant={
                    activeQuickSelect === "month" ? "primary" : "default"
                  }
                  size="small"
                />
              </View>
              <Pressable
                style={styles.closeButton}
                onPress={() => setShowModal(false)}
              >
                <MaterialCommunityIcons
                  name="close"
                  size={24}
                  color="#666666"
                />
              </Pressable>
            </View>
            <CalendarPicker
              startFromMonday={false}
              allowRangeSelection={true}
              selectedStartDate={tempStartDate}
              selectedEndDate={tempEndDate}
              onDateChange={handleDateChange}
              width={300}
              selectedDayColor="#69BAFF"
              selectedDayTextColor="#FFFFFF"
              todayBackgroundColor="#E5F2FF"
              todayTextStyle={{ color: "#69BAFF", fontWeight: "bold" }}
              textStyle={{ color: "#333333", fontSize: 14 }}
              monthTitleStyle={{
                color: "#333333",
                fontSize: 16,
                fontWeight: "600",
              }}
              yearTitleStyle={{
                color: "#333333",
                fontSize: 16,
                fontWeight: "600",
              }}
              dayLabelsWrapper={{ borderBottomWidth: 0, borderTopWidth: 0 }}
              customDatesStyles={[
                {
                  date: new Date(),
                  style: { backgroundColor: "#E5F2FF" },
                  textStyle: { color: "#69BAFF", fontWeight: "bold" },
                },
              ]}
              disabledDates={(date) => {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const compareDate = new Date(date);
                compareDate.setHours(0, 0, 0, 0);
                return compareDate.getTime() > today.getTime();
              }}
              previousTitle="이전"
              nextTitle="다음"
              previousTitleStyle={{ color: "#666666" }}
              nextTitleStyle={{ color: "#666666" }}
            />

            <View style={styles.buttonContainer}>
              <Pressable
                style={[styles.button, styles.cancelButton]}
                onPress={() => setShowModal(false)}
              >
                <Text style={styles.buttonText}>취소</Text>
              </Pressable>
              <Pressable
                style={[styles.button, styles.confirmButton]}
                onPress={handleConfirm}
              >
                <Text style={[styles.buttonText, styles.confirmButtonText]}>
                  확인
                </Text>
              </Pressable>
            </View>
          </View>
        </Pressable>
      </Modal>

      {showStartPicker && (
        <DateTimePicker
          value={startDate}
          mode="date"
          onChange={handleStartDateChange}
        />
      )}
      {showEndPicker && (
        <DateTimePicker
          value={endDate}
          mode="date"
          onChange={handleEndDateChange}
        />
      )}

      {showQuickSelectModal && (
        <View style={styles.modalContainer}>
          <Pressable style={styles.modalOption} onPress={handleToday}>
            <Text style={styles.modalOptionText}>오늘</Text>
          </Pressable>
          <Pressable style={styles.modalOption} onPress={handleThisWeek}>
            <Text style={styles.modalOptionText}>이번 주</Text>
          </Pressable>
          <Pressable style={styles.modalOption} onPress={handleThisMonth}>
            <Text style={styles.modalOptionText}>이번 달</Text>
          </Pressable>
        </View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
  },
  dateRangeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  calendarIcon: {
    marginRight: 12,
  },
  dateRangeButton: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    borderRadius: 6,
    padding: 8,
  },
  dateTextContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  dateText: {
    fontSize: 14,
    color: "#333333",
    fontWeight: "500",
  },
  separator: {
    color: "#666666",
    paddingHorizontal: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    width: "90%",
    maxWidth: 340,
  },
  calendarHeader: {
    marginBottom: 16,
  },
  calendarTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 12,
  },
  quickSelectContainer: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },
  closeButton: {
    position: "absolute",
    right: 0,
    top: 0,
    padding: 4,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#F5F5F5",
  },
  confirmButton: {
    backgroundColor: "#69BAFF",
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666666",
  },
  confirmButtonText: {
    color: "#FFFFFF",
  },
  dateRangeButtonDisabled: {
    backgroundColor: "#F5F5F5",
    opacity: 0.7,
  },
  dateTextDisabled: {
    color: "#999999",
  },
  modalContainer: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalOption: {
    paddingVertical: 12,
  },
  modalOptionText: {
    fontSize: 16,
    color: "#333333",
  },
});
