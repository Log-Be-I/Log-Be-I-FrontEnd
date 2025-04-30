// ✅ 수정된 Custom TimePicker 컴포넌트
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
} from "react-native";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

const ITEM_HEIGHT = 40;
const VISIBLE_ITEMS = 5;
const CENTER_INDEX = Math.floor(VISIBLE_ITEMS / 2);

const TimePicker = ({ value, onChange }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedHour, setSelectedHour] = useState(12);
  const [selectedMinute, setSelectedMinute] = useState(0);

  const hourScrollRef = useRef();
  const minuteScrollRef = useRef();

  useEffect(() => {
    if (value) {
      const hours = value.getHours();
      const minutes = value.getMinutes();
      setSelectedHour(hours);
      setSelectedMinute(minutes);
    }
  }, [value]);

  const handleOpenModal = () => {
    setModalVisible(true);
    setTimeout(() => {
      scrollToSelected(hourScrollRef, selectedHour);
      scrollToSelected(minuteScrollRef, selectedMinute / 10);
    }, 10);
  };

  const handleConfirm = () => {
    const newDate = new Date(value);
    newDate.setHours(selectedHour, selectedMinute, 0, 0);
    onChange(newDate);
    setModalVisible(false);
  };

  const scrollToSelected = (ref, index) => {
    if (ref.current) {
      ref.current.scrollTo({
        y: (index - CENTER_INDEX) * ITEM_HEIGHT,
        animated: false,
      });
    }
  };

  const renderNumberPicker = (items, selected, onSelect, ref) => (
    <ScrollView
      ref={ref}
      style={styles.picker}
      showsVerticalScrollIndicator={false}
      snapToInterval={ITEM_HEIGHT}
      decelerationRate="fast"
    >
      {items.map((item, idx) => (
        <TouchableOpacity
          key={item}
          style={[styles.pickerItem]}
          onPress={() => onSelect(item)}
        >
          <Text
            style={[
              styles.pickerItemText,
              selected === item && styles.selectedItemText,
            ]}
          >
            {item.toString().padStart(2, "0")}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 6 }, (_, i) => i * 10);

  return (
    <View>
      <TouchableOpacity style={styles.timeButton} onPress={handleOpenModal}>
        <Text style={styles.timeText}>
          {format(value, "HH:mm", { locale: ko })}
        </Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>시간 선택</Text>

            <View style={styles.pickerContainer}>
              {renderNumberPicker(
                hours,
                selectedHour,
                setSelectedHour,
                hourScrollRef
              )}
              <Text style={styles.colon}>:</Text>
              {renderNumberPicker(
                minutes,
                selectedMinute,
                setSelectedMinute,
                minuteScrollRef
              )}
              <View style={styles.highlightOverlay} />
            </View>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.footerButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButton}>취소</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.footerButton, styles.confirmButton]}
                onPress={handleConfirm}
              >
                <Text style={styles.confirmButtonText}>확인</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  timeButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: "white",
    marginTop: 8,
  },
  timeText: {
    fontSize: 16,
    color: "#032B77",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 20,
    width: "80%",
    paddingBottom: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#032B77",
    padding: 16,
  },
  pickerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: ITEM_HEIGHT * VISIBLE_ITEMS,
    overflow: "hidden",
    position: "relative",
  },
  picker: {
    width: 60,
    height: ITEM_HEIGHT * VISIBLE_ITEMS,
  },
  pickerItem: {
    height: ITEM_HEIGHT,
    justifyContent: "center",
    alignItems: "center",
  },
  pickerItemText: {
    fontSize: 18,
    color: "#666",
  },
  selectedItemText: {
    color: "#032B77",
    fontWeight: "bold",
  },
  colon: {
    fontSize: 24,
    color: "#032B77",
    marginHorizontal: 10,
  },
  highlightOverlay: {
    position: "absolute",
    top: ITEM_HEIGHT * CENTER_INDEX,
    height: ITEM_HEIGHT,
    width: "100%",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#69BAFF",
  },
  modalFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#E5E5E5",
  },
  footerButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 8,
    marginHorizontal: 4,
  },
  cancelButton: {
    color: "#666",
    fontSize: 16,
  },
  confirmButton: {
    backgroundColor: "#69BAFF",
  },
  confirmButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default TimePicker;
