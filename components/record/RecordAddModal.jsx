import React, { useState } from "react";
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

export default function RecordAddModal({ visible, onClose, onSave }) {
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(
    new Date().toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
    })
  );
  const [category, setCategory] = useState(CATEGORIES[0].category_id);
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [charCount, setCharCount] = useState(0);
  const [showCalendar, setShowCalendar] = useState(false);

  const scaleAnim = React.useRef(new Animated.Value(0.95)).current;
  const opacityAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (visible) {
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
    setError("");
    setContent("");
    setCharCount(0);
    setDate(new Date());
    setTime(
      new Date().toLocaleTimeString("ko-KR", {
        hour: "2-digit",
        minute: "2-digit",
      })
    );
    setCategory(CATEGORIES[0].category_id);
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
          <View style={styles.contentWrapper}>
            <Pressable
              style={styles.dateContainer}
              onPress={() => setShowCalendar(true)}
            >
              <MaterialCommunityIcons
                name="calendar"
                size={20}
                color="#69BAFF"
              />
              <Text style={styles.dateText}>{formatDate(date)}</Text>
            </Pressable>

            <View style={styles.timeContainer}>
              <View style={styles.timeLine} />
              <TimePickerInput
                value={time}
                onChange={setTime}
                isEditing={true}
                style={styles.timeInput}
              />
              <View style={styles.timeLine} />
            </View>

            <View style={styles.categoryContainer}>
              <CategoryDropdown
                value={category}
                onChange={setCategory}
                isEditing={true}
              />
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={[
                  styles.contentInput,
                  error ? styles.contentInputError : null,
                ]}
                multiline
                value={content}
                onChangeText={handleContentChange}
                placeholder="내용을 입력하세요"
                placeholderTextColor="#999999"
              />
              <Text style={styles.charCount}>{charCount}/500</Text>
            </View>
            {error && <Text style={styles.errorText}>{error}</Text>}
          </View>

          <View style={styles.buttonContainer}>
            <Pressable
              style={[styles.button, styles.cancelButton]}
              onPress={handleClose}
            >
              <Text style={styles.cancelButtonText}>취소</Text>
            </Pressable>
            <Pressable
              style={[styles.button, styles.saveButton]}
              onPress={handleSave}
            >
              <Text style={styles.saveButtonText}>기록</Text>
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
  timeInput: {
    marginHorizontal: 20,
  },
  categoryContainer: {
    marginBottom: 16,
    alignSelf: "flex-start",
  },
  inputContainer: {
    marginBottom: 8,
  },
  contentInput: {
    minHeight: 120,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    fontSize: 14,
    color: "#333333",
    textAlignVertical: "top",
    marginBottom: 8,
    borderWidth: 0.5,
    borderColor: "#69BAFF",
  },
  contentInputError: {
    borderColor: "#FF4444",
  },
  charCount: {
    fontSize: 12,
    color: "#666666",
    textAlign: "right",
  },
  errorText: {
    color: "#FF4444",
    fontSize: 12,
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
  cancelButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666666",
  },
  saveButtonText: {
    fontSize: 14,
    fontWeight: "600",
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
