import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Keyboard,
  TouchableWithoutFeedback,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Alert,
  Switch,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import DateRangeSelector from "../../../components/calendar/DateRangeSelector";
import CalendarButton from "../../../components/calendar/CalendarButton";
import {
  updateSchedule,
  deleteSchedule,
} from "../../../api/schedule/scheduleApi";
import Icon from "react-native-vector-icons/MaterialIcons";
import CancelModal from "../../../components/common/CancelModal";
import Toast from "../../../components/common/Toast";
import AllDayToggle from "../../../components/calendar/AllDayToggle";

export default function EditSchedule() {
  const router = useRouter();
  const scrollViewRef = useRef(null);
  const params = useLocalSearchParams();
  const schedule = JSON.parse(params.schedule);
  console.log("수정할editSchedule", schedule);
  const [title, setTitle] = useState(schedule.title || schedule.name);
  const [startTime, setStartTime] = useState(new Date(schedule.startDateTime));
  const [endTime, setEndTime] = useState(new Date(schedule.endDateTime));
  const [isEditing, setIsEditing] = useState(false);
  const [originalTitle, setOriginalTitle] = useState(title);
  const [originalStartTime, setOriginalStartTime] = useState(startTime);
  const [originalEndTime, setOriginalEndTime] = useState(endTime);
  const [isAllDay, setIsAllDay] = useState(schedule.isAllDay || false);

  const [showCalendar, setShowCalendar] = useState(false);
  const [calendarOpenCount, setCalendarOpenCount] = useState(0);

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  const handleDateRangeChange = (start, end) => {
    setStartTime(start);
    setEndTime(end);
    // 하루종일이 아닐 때만 isAllDay 상태 변경
    if (!isAllDay) {
      setIsAllDay(false);
    }
  };

  const handleAllDayToggle = (value) => {
    setIsAllDay(value);
    if (value) {
      // 하루종일로 설정할 때
      const today = new Date(startTime);
      today.setHours(0, 0, 0, 0);
      const endOfDay = new Date(startTime);
      endOfDay.setHours(23, 50, 0, 0);
      setStartTime(today);
      setEndTime(endOfDay);
    } else {
      // 하루종일 해제할 때
      const now = new Date();
      const newStartTime = new Date(startTime);
      newStartTime.setHours(now.getHours(), now.getMinutes(), 0, 0);
      const newEndTime = new Date(startTime);
      newEndTime.setHours(now.getHours() + 1, now.getMinutes(), 0, 0);
      setStartTime(newStartTime);
      setEndTime(newEndTime);
    }
  };

  const handleCalendarOpen = () => {
    setShowCalendar(true);
    setCalendarOpenCount((prev) => prev + 1);
  };

  useEffect(() => {
    if (scrollViewRef.current) {
      // 달력이 열릴때 자동 스크롤
      scrollViewRef.current?.scrollTo({ y: 85, animated: true });
    }
  }, [calendarOpenCount]);

  const handleEdit = async () => {
    try {
      await updateSchedule(schedule.id, {
        title,
        startTime,
        endTime,
        isAllDay,
      });
      setOriginalTitle(title);
      setOriginalStartTime(startTime);
      setOriginalEndTime(endTime);
      setIsEditing(false);
      setTimeout(() => {
        router.replace("/calendar/");
      }, 1000);
    } catch (error) {
      console.error("일정 수정 실패:", error);
      setToastMessage("일정 수정에 실패했습니다.");
      setShowToast(true);
    }
  };

  const handleCancelEdit = async () => {
    setTitle(originalTitle);
    setStartTime(originalStartTime);
    setEndTime(originalEndTime);
    setIsAllDay(schedule.isAllDay || false);
    setIsEditing(false);
  };

  const handleDelete = async () => {
    setModalVisible(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteSchedule(schedule.id);
      setModalVisible(false);
      setToastMessage("일정이 삭제되었습니다.");
      setShowToast(true);
      setTimeout(() => {
        router.replace("/calendar/");
      }, 1000);
    } catch (error) {
      console.error("일정 삭제 실패:", error);
      setToastMessage("일정 삭제에 실패했습니다.");
      setShowToast(true);
    }
  };

  const handleCancel = async () => {
    router.back(); // 취소하면 이전 화면으로 돌아가기
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView behavior="height" style={styles.flex}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <ScrollView
            ref={scrollViewRef}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
            style={styles.scrollContent}
          >
            <View style={styles.inputBoxWrapper}>
              {isEditing ? (
                <View>
                  <TextInput
                    style={styles.input}
                    value={title}
                    onChangeText={setTitle}
                    placeholder="일정"
                  />
                  <View style={styles.allDayContainer}>
                    <AllDayToggle
                      value={isAllDay}
                      onValueChange={handleAllDayToggle}
                    />
                  </View>
                </View>
              ) : (
                <Text style={styles.title} onPress={() => setIsEditing(true)}>
                  {title}
                </Text>
              )}

              <View style={styles.dateRangeBox}>
                <DateRangeSelector
                  startDate={startTime}
                  endDate={endTime}
                  onDateRangeChange={handleDateRangeChange}
                  disabled={!isEditing}
                  onChange={() => setIsEditing(true)}
                  onCalendarOpen={handleCalendarOpen}
                  isAllDay={isAllDay}
                />
              </View>
            </View>

            <View style={styles.buttonContainer}>
              {isEditing ? (
                <>
                  <CalendarButton
                    text="취소"
                    onPress={handleCancelEdit}
                    type="cancel"
                  />
                  <CalendarButton
                    text="수정"
                    onPress={handleEdit}
                    type="edit"
                  />
                </>
              ) : (
                <>
                  <CalendarButton
                    text="확인"
                    onPress={handleCancel}
                    type="ok"
                  />
                  <CalendarButton
                    text="삭제"
                    onPress={handleDelete}
                    type="delete"
                  />
                </>
              )}
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>

        <CancelModal
          visible={modalVisible}
          onCancel={() => setModalVisible(false)}
          onDelete={handleConfirmDelete}
        />
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
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  flex: {
    flex: 1,
  },
  inputBoxWrapper: {
    width: "90%",
    marginTop: 56,
    marginHorizontal: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: "#69BAFF", // 하늘색 윤곽선
    borderRadius: 16,
    backgroundColor: "#FFFFFF" /*'#F9FCFF'*/, // 연한 파란 배경 (선택사항)
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
    marginBottom: 40,
    backgroundColor: "white",
    width: "100%",
    gap: 50,
    paddingVertical: 5,
    paddingHorizontal: 16,
  },
  editButtonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "flex-start",
    marginTop: 10,
    backgroundColor: "white",
    width: "100%",
    gap: 24,
    paddingVertical: 5,
    paddingHorizontal: 16,
  },
  title: {
    backgroundColor: "white",
    fontWeight: "bold",
    color: "#032B77",
    fontSize: 18,
    borderBottomWidth: 1,
    borderColor: "#69BAFF",
    borderRadius: 8,
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  titleInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderColor: "#69BAFF",
    borderRadius: 8,
    marginTop: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  input: {
    backgroundColor: "white",
    fontWeight: "semibold",
    color: "#032B77",
    fontSize: 18,
    borderBottomWidth: 1,
    borderColor: "#69BAFF",
    borderRadius: 8,
    marginTop: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
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
  scrollWrapper: {
    flex: 1,
    marginTop: 10,
    backgroundColor: "white",
  },
  scrollContent: {
    paddingBottom: 100,
    paddingTop: 0,
    flexGrow: 1, // 내용이 적어도 ScrollView가 가능하도록
  },
});
