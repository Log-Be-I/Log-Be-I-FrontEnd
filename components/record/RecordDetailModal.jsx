import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TextInput,
  Pressable,
  Animated,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import TimePickerInput from "./TimePickerInput";
import CategoryDropdown from "./CategoryDropdown";
import RecordEditDateRange from "./RecordEditDateRange";
import { CATEGORIES } from "../../constants/CategoryData";
import { useMemberStore } from "../../zustand/stores/member";
import dayjs from "dayjs";

export default function RecordDetailModal({
  visible,
  onClose,
  record,
  onSave,
}) {
  const { member } = useMemberStore();
  const [isEditing, setIsEditing] = useState(false);
  const [date, setDate] = useState(dayjs().toDate());
  const [time, setTime] = useState(dayjs().format("HH:mm"));
  const [category, setCategory] = useState(
    record?.categoryId || CATEGORIES[0].categoryId
  );
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [charCount, setCharCount] = useState(0);
  const [showCalendar, setShowCalendar] = useState(false);

  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    return () => {
      scaleAnim.setValue(0.95);
      opacityAnim.setValue(0);
      console.log("전달받은 recordDetail", record);
    };
  }, []);

  useEffect(() => {
    if (visible && record) {
      const d = dayjs(record.recordDateTime);
      setDate(d.toDate());
      setTime(d.format("HH:mm"));
      setCategory(record.categoryId || CATEGORIES[0].categoryId);
      setContent(record.content || "");
      setCharCount((record.content || "").length);
    } else if (visible) {
      const now = dayjs();
      setDate(now.toDate());
      setTime(now.format("HH:mm"));
      setCategory(CATEGORIES[0].categoryId);
      setContent("");
      setCharCount(0);
    }
  }, [visible, record]);

  const formatDate = (date) => {
    return dayjs(date).format("YYYY년 M월 D일");
  };

  const handleSave = () => {
    if (!content.trim()) {
      setError("내용을 입력해주세요.");
      return;
    }
    const [hours, minutes] = time.split(":").map(Number);
    const selectedDate = dayjs(date).hour(hours).minute(minutes).second(0);
    const recordDateTime = selectedDate.format("YYYY-MM-DDTHH:mm:ss");
    onSave({
      recordDateTime,
      categoryId: Number(category),
      content: content.trim(),
      memberId: member.memberId,
    });
    handleClose();
  };

  const handleClose = () => {
    setIsEditing(false);
    setError("");
    onClose();
  };

  const handleContentChange = (text) => {
    if (text.length <= 500) {
      setContent(text);
      setCharCount(text.length);
      setError("");
    }
  };

  const handleDateChange = (newDate) => {
    const koreanDate = new Date(
      newDate.toDate().getTime() + 9 * 60 * 60 * 1000
    );
    setDate(koreanDate);
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      onRequestClose={handleClose}
      animationType="none"
    >
      <View style={styles.modalOverlay}>
        <Animated.View
          style={[
            styles.modalContent,
            {
              opacity: opacityAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          {!record ? (
            <View style={{ padding: 40 }}>
              <Text style={{ color: "red", textAlign: "center", fontSize: 16 }}>
                기록 정보를 불러올 수 없습니다.
              </Text>
              <Pressable
                style={{ marginTop: 20, alignSelf: "center" }}
                onPress={handleClose}
              >
                <Text style={{ color: "#69BAFF", fontWeight: "bold" }}>
                  닫기
                </Text>
              </Pressable>
            </View>
          ) : (
            <View style={styles.contentWrapper}>
              <Pressable
                style={styles.dateContainer}
                onPress={() => isEditing && setShowCalendar(true)}
              >
                <MaterialCommunityIcons
                  name="calendar"
                  size={20}
                  color={isEditing ? "#69BAFF" : "#666666"}
                />
                <Text style={styles.dateText}>{formatDate(date)}</Text>
              </Pressable>

              <View style={styles.timeContainer}>
                <View style={styles.timeLine} />
                <View style={styles.timeInputContainer}>
                  <TimePickerInput
                    value={time}
                    onChange={setTime}
                    isEditing={isEditing}
                    style={styles.timeInput}
                  />
                </View>
                <View style={styles.timeLine} />
              </View>

              <View style={styles.categoryContainer}>
                <CategoryDropdown
                  value={category}
                  onChange={setCategory}
                  isEditing={isEditing}
                />
              </View>

              <View style={styles.contentInputContainer}>
                <TextInput
                  style={[
                    styles.contentInput,
                    isEditing ? styles.contentInputEditing : null,
                    error ? styles.contentInputError : null,
                  ]}
                  multiline
                  value={content}
                  onChangeText={handleContentChange}
                  editable={isEditing}
                  placeholder={isEditing ? "내용을 입력하세요" : ""}
                  placeholderTextColor="#999999"
                />
                {error && <Text style={styles.errorText}>{error}</Text>}
                {isEditing && (
                  <Text style={styles.charCount}>{charCount}/500</Text>
                )}
              </View>
            </View>
          )}

          <View style={styles.buttonContainer}>
            <Pressable
              style={[
                styles.button,
                isEditing ? styles.cancelButton : styles.editButton,
              ]}
              onPress={() => (isEditing ? handleClose() : setIsEditing(true))}
            >
              <Text
                style={[
                  styles.buttonText,
                  isEditing ? styles.cancelButtonText : styles.editButtonText,
                ]}
              >
                {isEditing ? "취소" : "수정"}
              </Text>
            </Pressable>
            <Pressable
              style={[
                styles.button,
                isEditing ? styles.saveButton : styles.okButton,
              ]}
              onPress={isEditing ? handleSave : handleClose}
            >
              <Text
                style={[
                  styles.buttonText,
                  isEditing ? styles.saveButtonText : styles.okButtonText,
                ]}
              >
                {isEditing ? "저장" : "확인"}
              </Text>
            </Pressable>
          </View>
        </Animated.View>

        <Modal
          visible={showCalendar}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowCalendar(false)}
        >
          <View style={styles.calendarModalOverlay}>
            <View style={styles.calendarModalContent}>
              <View style={styles.calendarHeader}>
                <Text style={styles.calendarTitle}>날짜 선택</Text>
                <Pressable
                  style={styles.closeButton}
                  onPress={() => setShowCalendar(false)}
                >
                  <MaterialCommunityIcons
                    name="close"
                    size={24}
                    color="#666666"
                  />
                </Pressable>
              </View>
              <RecordEditDateRange
                date={date}
                onDateChange={(newDate) => {
                  setDate(new Date(newDate));
                  setShowCalendar(false);
                }}
              />
            </View>
          </View>
        </Modal>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 30,
    width: "90%",
    maxWidth: 400,
    overflow: "hidden",
  },
  contentWrapper: {
    padding: 24,
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  dateText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333333",
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
    paddingVertical: 8,
  },
  timeLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#69BAFF",
  },
  timeInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
  },
  timeInput: {
    marginHorizontal: 20,
  },
  categoryContainer: {
    marginBottom: 16,
    alignSelf: "flex-start",
  },
  contentInputContainer: {
    minHeight: 120,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 8,
    borderWidth: 0.5,
    borderColor: "#69BAFF",
  },
  contentInput: {
    minHeight: 120,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    fontSize: 14,
    color: "#333333",
    textAlignVertical: "top",
  },
  contentInputEditing: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#69BAFF",
  },
  contentInputError: {
    borderColor: "#FF4444",
  },
  errorText: {
    color: "#FF4444",
    fontSize: 12,
    marginTop: 4,
  },
  charCount: {
    fontSize: 12,
    color: "#666666",
    textAlign: "right",
    marginTop: 4,
  },
  buttonContainer: {
    flexDirection: "row",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  editButton: {
    backgroundColor: "#F5F5F5",
  },
  okButton: {
    backgroundColor: "#69BAFF",
  },
  cancelButton: {
    backgroundColor: "#F5F5F5",
  },
  saveButton: {
    backgroundColor: "#69BAFF",
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "600",
  },
  editButtonText: {
    color: "#666666",
  },
  okButtonText: {
    color: "#FFFFFF",
  },
  cancelButtonText: {
    color: "#666666",
  },
  saveButtonText: {
    color: "#FFFFFF",
  },
  calendarModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  calendarModalContent: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    width: "90%",
    maxWidth: 400,
  },
  calendarHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  calendarTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333333",
  },
  closeButton: {
    padding: 4,
  },
});
