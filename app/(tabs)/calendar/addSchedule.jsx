import React, { useState, useEffect, useRef } from "react";
import {
  Text,
  View,
  TextInput,
  StyleSheet,
  Keyboard,
  TouchableWithoutFeedback,
  ScrollView,
  KeyboardAvoidingView,
  Switch,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import DateRangeSelector from "../../../components/calendar/DateRangeSelector";
import CalendarButton from "../../../components/calendar/CalendarButton";
import { createTextSchedule } from "../../../api/schedule/scheduleApi";
import Toast from "../../../components/common/Toast";
import Icon from "react-native-vector-icons/MaterialIcons";
import AllDayToggle from "../../../components/calendar/AllDayToggle";

export default function AddSchedule() {
  const router = useRouter();
  const scrollViewRef = useRef(null);
  const { selectedDate } = useLocalSearchParams();

  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState(new Date(selectedDate));
  const [endDate, setEndDate] = useState(new Date(selectedDate));
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [isAllDay, setIsAllDay] = useState(false);

  const isAddDisabled = !title.trim() || startDate > endDate;

  const titleInputRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      titleInputRef.current?.focus();
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const getKoreanDateString = (date) => {
    const koreanDate = new Date(date.getTime() + 9 * 60 * 60 * 1000); // UTC+9 적용
    return koreanDate.toISOString().split("T")[0];
  };

  const handleDateRangeChange = (start, end) => {
    setStartDate(start);
    setEndDate(end);
  };

  const handleAllDayToggle = (value) => {
    setIsAllDay(value);
    if (value) {
      // 하루종일로 설정할 때
      const today = new Date(startDate);
      today.setHours(0, 0, 0, 0);
      const endOfDay = new Date(startDate);
      endOfDay.setHours(23, 50, 0, 0);
      setStartDate(today);
      setEndDate(endOfDay);
    } else {
      // 하루종일 해제할 때
      const now = new Date();
      const newStartDate = new Date(startDate);
      newStartDate.setHours(now.getHours(), now.getMinutes(), 0, 0);
      const newEndDate = new Date(startDate);
      newEndDate.setHours(now.getHours() + 1, now.getMinutes(), 0, 0);
      setStartDate(newStartDate);
      setEndDate(newEndDate);
    }
  };

  const handleAdd = async () => {
    if (isAddDisabled) {
      setToastMessage("제목을 입력해주세요.");
      setShowToast(true);
      return;
    }

    try {
      await createTextSchedule({
        title,
        startDateTime: startDate,
        endDateTime: endDate,
      });

      setToastMessage("일정이 성공적으로 추가되었습니다.");
      setShowToast(true);

      setTimeout(() => {
        router.replace({
          pathname: "/(tabs)/calendar/",
          params: {
            refresh: true,
            selectedDate: getKoreanDateString(startDate),
            currentMonth: startDate.getMonth() + 1,
            currentYear: startDate.getFullYear()
          },
        });
      }, 1000);
    } catch (error) {
      console.error("일정 추가 실패:", error);
      setToastMessage("일정 등록에 실패했습니다.");
      setShowToast(true);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView behavior="height" style={{ flex: 1 }}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            ref={scrollViewRef}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.inputBoxWrapper}>
              <TextInput
                ref={titleInputRef}
                style={styles.titleInput}
                placeholder="예: 팀 회의, 공부 계획, 병원 예약"
                value={title}
                onChangeText={setTitle}
                multiline
                maxLength={50}
                numberOfLines={3}
                textAlignVertical="top"
                returnKeyType="done"
                onSubmitEditing={Keyboard.dismiss}
              />
              <View style={styles.allDayContainer}>
                <AllDayToggle
                  value={isAllDay}
                  onValueChange={handleAllDayToggle}
                />
              </View>
              <View style={styles.dateRangeBox}>
                <DateRangeSelector
                  startDate={startDate}
                  endDate={endDate}
                  onDateRangeChange={handleDateRangeChange}
                  isAllDay={isAllDay}
                />
              </View>
            </View>

            <View style={styles.buttonContainer}>
              <CalendarButton
                text="취소"
                onPress={handleCancel}
                type="cancel"
              />
              <CalendarButton text="저장" onPress={handleAdd} type="primary" />
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>

        <Toast
          visible={showToast}
          message={toastMessage}
          onHide={() => setShowToast(false)}
        />
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white" },
  inputBoxWrapper: {
    width: "90%",
    marginTop: 56,
    marginHorizontal: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: "#69BAFF",
    borderRadius: 16,
    backgroundColor: "white",
    elevation: 2,
  },
  titleInput: {
    fontWeight: "bold",
    color: "#032B77",
    fontSize: 18,
    borderBottomWidth: 1,
    borderColor: "#69BAFF",
    borderRadius: 8,
    marginTop: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "white",
  },
  allDayContainer: {
    marginTop: 8,
    marginBottom: 8,
  },
  allDayText: {
    marginLeft: 8,
    marginRight: 8,
    color: "#666",
    fontSize: 14,
  },
  dateRangeBox: {
    marginTop: 8,
  },
  scrollContent: {
    paddingBottom: 100,
    paddingTop: 0,
    flexGrow: 1,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 30,
    gap: 50,
  },
});
