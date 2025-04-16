import React, { useState, useEffect } from "react";
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

export default function RecordDetailModal({
  visible,
  onClose,
  record,
  onSave,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState("00:00");
  const [category, setCategory] = useState(CATEGORIES[0].category_id);
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [charCount, setCharCount] = useState(0);
  const [showCalendar, setShowCalendar] = useState(false);

  const scaleAnim = React.useRef(new Animated.Value(0.95)).current;
  const opacityAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      setInitialData();
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
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

  const setInitialData = () => {
    if (record) {
      setDate(new Date(record.record_date));
      setTime(record.record_time);
      setCategory(record.category_id || CATEGORIES[0].category_id);
      setContent(record.content || "");
      setCharCount(record.content?.length || 0);
    } else {
      setDate(new Date());
      setTime(
        new Date().toLocaleTimeString("ko-KR", {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
      setCategory(CATEGORIES[0].category_id);
      setContent("");
      setCharCount(0);
    }
  };

  const handleSave = () => {
    if (!content.trim()) {
      setError("내용을 입력해주세요.");
      return;
    }

    onSave({
      record_date: date.toISOString().split("T")[0],
      record_time: time,
      category_id: category,
      content: content.trim(),
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

  const formatDate = (date) => {
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleDateChange = (newDate) => {
    setDate(newDate.toDate());
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
          <View style={styles.header}>
            <Pressable
              style={styles.dateContainer}
              onPress={() => isEditing && setShowCalendar(true)}
            >
              <MaterialCommunityIcons
                name="calendar"
                size={24}
                color={isEditing ? "#69BAFF" : "#666666"}
              />
              <Text style={styles.dateText}>{formatDate(date)}</Text>
            </Pressable>
            <TimePickerInput
              value={time}
              onChange={setTime}
              isEditing={isEditing}
            />
          </View>

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

          <View style={styles.categoryContainer}>
            <CategoryDropdown
              value={category}
              onChange={setCategory}
              isEditing={isEditing}
            />
          </View>

          <View style={styles.contentContainer}>
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
            {isEditing && <Text style={styles.charCount}>{charCount}/500</Text>}
          </View>

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
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    width: "90%",
    maxWidth: 400,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  dateText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333333",
  },
  calendarModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  calendarModalContent: {
    backgroundColor: "white",
    borderRadius: 16,
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
  categoryContainer: {
    marginBottom: 16,
  },
  contentContainer: {
    marginBottom: 16,
  },
  contentInput: {
    minHeight: 120,
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: "#333333",
    textAlignVertical: "top",
  },
  contentInputEditing: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E5E5",
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
    justifyContent: "space-between",
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
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
});
