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
  const [category, setCategory] = useState(CATEGORIES[0].categoryId);
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [showCalendar, setShowCalendar] = useState(false);
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible && record) {
      const d = dayjs(record.recordDateTime);
      setDate(d.toDate());
      setTime(d.format("HH:mm"));
      setCategory(record.categoryId || CATEGORIES[0].categoryId);
      setContent(record.content || "");
    } else if (visible) {
      const now = dayjs();
      setDate(now.toDate());
      setTime(now.format("HH:mm"));
      setCategory(CATEGORIES[0].categoryId);
      setContent("");
    }
  }, [visible, record]);

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      scaleAnim.setValue(0.95);
      opacityAnim.setValue(0);
    }
  }, [visible]);

  const handleSave = async () => {
    if (!content.trim()) {
      setError("내용을 입력해주세요.");
      return;
    }
    const [hours, minutes] = time.split(":").map(Number);
    const selectedDate = dayjs(date).hour(hours).minute(minutes).second(0);

    try {
      await onSave({
        recordId: record.recordId,
        recordDateTime: selectedDate.format("YYYY-MM-DDTHH:mm:ss"),
        categoryId: Number(category),
        content: content.trim(),
        memberId: member.memberId,
      });
      handleClose();
    } catch (error) {
      console.error(error);
      alert("❌ 저장 중 오류가 발생했습니다.");
    }
  };

  const handleClose = () => {
    setIsEditing(false);
    setError("");
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      onRequestClose={handleClose}
      animationType="none"
    >
      <View style={styles.modalOverlay}>
        <Animated.View
          style={[
            styles.modalContent,
            { opacity: opacityAnim, transform: [{ scale: scaleAnim }] },
          ]}
        >
          {!record ? (
            <View style={styles.errorWrapper}>
              <Text style={styles.errorText}>
                기록 정보를 불러올 수 없습니다.
              </Text>
              <Pressable style={styles.errorButton} onPress={handleClose}>
                <Text style={styles.errorButtonText}>닫기</Text>
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
                <Text style={styles.dateText}>
                  {dayjs(date).format("YYYY년 M월 D일")}
                </Text>
              </Pressable>

              <View style={styles.timeContainer}>
                <View style={styles.timeLine} />
                <TimePickerInput
                  value={time}
                  onChange={setTime}
                  isEditing={isEditing}
                />
                <View style={styles.timeLine} />
              </View>

              <CategoryDropdown
                value={category}
                onChange={setCategory}
                isEditing={isEditing}
              />

              <TextInput
                style={[
                  styles.contentInput,
                  isEditing && styles.contentInputEditing,
                  error && styles.contentInputError,
                ]}
                multiline
                value={content}
                onChangeText={(text) => {
                  if (text.length <= 500) setContent(text);
                  setError("");
                }}
                editable={isEditing}
                placeholder={isEditing ? "내용을 입력하세요" : ""}
                placeholderTextColor="#999999"
              />
              {error && <Text style={styles.errorMsg}>{error}</Text>}
            </View>
          )}

          <View style={styles.buttonContainer}>
            <Pressable
              style={[styles.button, styles.secondaryButton]}
              onPress={() => (isEditing ? handleClose() : setIsEditing(true))}
            >
              <Text style={styles.secondaryButtonText}>
                {isEditing ? "취소" : "수정"}
              </Text>
            </Pressable>
            <Pressable
              style={[styles.button, styles.primaryButton]}
              onPress={isEditing ? handleSave : handleClose}
            >
              <Text style={styles.primaryButtonText}>
                {isEditing ? "저장" : "확인"}
              </Text>
            </Pressable>
          </View>
        </Animated.View>

        <Modal
          visible={showCalendar}
          transparent
          animationType="fade"
          onRequestClose={() => setShowCalendar(false)}
        >
          <View style={styles.calendarModalOverlay}>
            <View style={styles.calendarModalContent}>
              <View style={styles.calendarHeader}>
                <Text style={styles.calendarTitle}>날짜 선택</Text>
                <Pressable onPress={() => setShowCalendar(false)}>
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
  contentWrapper: { padding: 24 },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  dateText: { fontSize: 16, fontWeight: "500", color: "#333" },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  timeLine: { flex: 1, height: 1, backgroundColor: "#69BAFF" },
  contentInput: {
    minHeight: 120,
    borderRadius: 16,
    padding: 16,
    fontSize: 14,
    color: "#333",
    backgroundColor: "#FFF",
    marginTop: 8,
  },
  contentInputEditing: { borderWidth: 1, borderColor: "#69BAFF" },
  contentInputError: { borderColor: "#FF4444" },
  buttonContainer: {
    flexDirection: "row",
    padding: 16,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  secondaryButton: { backgroundColor: "#F5F5F5" },
  secondaryButtonText: { fontSize: 14, fontWeight: "600", color: "#666" },
  primaryButton: { backgroundColor: "#69BAFF" },
  primaryButtonText: { fontSize: 14, fontWeight: "600", color: "#FFF" },
  errorWrapper: { padding: 40, alignItems: "center" },
  errorText: { color: "red", fontSize: 16 },
  errorButton: { marginTop: 20 },
  errorButtonText: { color: "#69BAFF", fontWeight: "bold" },
  errorMsg: { color: "#FF4444", fontSize: 12, marginTop: 4 },
  calendarModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  calendarModalContent: {
    backgroundColor: "#FFF",
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
  calendarTitle: { fontSize: 18, fontWeight: "600", color: "#333" },
});
