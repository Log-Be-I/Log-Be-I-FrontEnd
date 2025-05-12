import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
} from "react-native";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

const ITEM_HEIGHT = 40;
const VISIBLE_ITEMS = 5;
const CENTER_INDEX = Math.floor(VISIBLE_ITEMS / 2);

export default function TimePicker({ value, onChange, isAllDay, isStart }) {
  const generateLoopedItems = (range, repeat, unit = 1) =>
    Array(repeat)
      .fill(Array.from({ length: range }, (_, i) => i * unit))
      .flat();

  const hours = generateLoopedItems(24, 3);
  const minutes = generateLoopedItems(6, 3, 10);

  const [selectedHourIndex, setSelectedHourIndex] = useState(24 + CENTER_INDEX);
  const [selectedMinuteIndex, setSelectedMinuteIndex] = useState(
    6 + CENTER_INDEX
  );
  const [modalVisible, setModalVisible] = useState(false);

  const hourListRef = useRef(null);
  const minuteListRef = useRef(null);

  // 외부에서 넘어온 value가 바뀌면 인덱스도 바꿈
  useEffect(() => {
    if (value) {
      const hour = value.getHours();
      const minute = value.getMinutes();
      const hourIdx = hours.findIndex((h, i) => i >= 24 && h === hour);
      const minuteIdx = minutes.findIndex((m, i) => i >= 6 && m === minute);
      if (hourIdx !== -1) setSelectedHourIndex(hourIdx);
      if (minuteIdx !== -1) setSelectedMinuteIndex(minuteIdx);
    }
  }, [value]);

  // 하루종일이면 시간 고정 (00:00 or 23:50)
  useEffect(() => {
    if (isAllDay) {
      const fixedHour = isStart ? 0 : 23;
      const fixedMinute = isStart ? 0 : 50;
      const hourIdx = hours.findIndex((h, i) => i >= 24 && h === fixedHour);
      const minuteIdx = minutes.findIndex(
        (m, i) => i >= 6 && m === fixedMinute
      );
      if (hourIdx !== -1) setSelectedHourIndex(hourIdx);
      if (minuteIdx !== -1) setSelectedMinuteIndex(minuteIdx);
    }
  }, [isAllDay, isStart]);

  const handleOpenModal = () => {
    setModalVisible(true);
    setTimeout(() => {
      hourListRef.current?.scrollToIndex({
        index: selectedHourIndex - CENTER_INDEX,
        animated: false,
      });
      minuteListRef.current?.scrollToIndex({
        index: selectedMinuteIndex - CENTER_INDEX,
        animated: false,
      });
    }, 10);
  };

  const handleConfirm = () => {
    const hour = hours[selectedHourIndex];
    const minute = minutes[selectedMinuteIndex];
    const newDate = new Date(value);
    newDate.setHours(hour, minute, 0, 0);
    onChange(newDate);
    setModalVisible(false);
  };

  const renderPicker = (data, selectedIndex, setSelectedIndex, ref) => (
    <FlatList
      ref={ref}
      data={data}
      keyExtractor={(_, index) => index.toString()}
      initialScrollIndex={selectedIndex - CENTER_INDEX}
      getItemLayout={(_, index) => ({
        length: ITEM_HEIGHT,
        offset: ITEM_HEIGHT * index,
        index,
      })}
      showsVerticalScrollIndicator={false}
      snapToInterval={ITEM_HEIGHT}
      decelerationRate="fast"
      onMomentumScrollEnd={(e) => {
        const index = Math.round(e.nativeEvent.contentOffset.y / ITEM_HEIGHT);
        setSelectedIndex(index + CENTER_INDEX); // 중앙 강조 기준
      }}
      renderItem={({ item }) => (
        <View style={styles.pickerItem}>
          <Text style={styles.pickerItemText}>
            {item.toString().padStart(2, "0")}
          </Text>
        </View>
      )}
      style={styles.picker}
    />
  );

  const hour = hours[selectedHourIndex];
  const minute = minutes[selectedMinuteIndex];

  const displayTime = isAllDay && !modalVisible
    ? `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`
    : `${value.getHours().toString().padStart(2, "0")}:${value.getMinutes().toString().padStart(2, "0")}`;

  return (
    <View>
      <TouchableOpacity
        style={[styles.timeButton, isAllDay && { opacity: 0.4 }]}
        onPress={!isAllDay ? handleOpenModal : undefined}
        disabled={isAllDay}
      >
        <Text style={styles.timeText}>{displayTime}</Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>시간 선택</Text>
            </View>

            <View style={styles.pickerContainer}>
              {renderPicker(
                hours,
                selectedHourIndex,
                setSelectedHourIndex,
                hourListRef
              )}
              <Text style={styles.colon}>:</Text>
              {renderPicker(
                minutes,
                selectedMinuteIndex,
                setSelectedMinuteIndex,
                minuteListRef
              )}
              <View style={styles.highlightOverlay} pointerEvents="none" />
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
}

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
  },
  modalHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#032B77",
  },
  pickerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    position: "relative",
  },
  picker: {
    height: ITEM_HEIGHT * VISIBLE_ITEMS,
    width: 60,
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
  highlightOverlay: {
    position: "absolute",
    top: ITEM_HEIGHT * CENTER_INDEX + 20,
    left: "15%",
    right: "15%",
    height: ITEM_HEIGHT,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#69BAFF",
    backgroundColor: "transparent",
    zIndex: 10,
  },
  colon: {
    fontSize: 24,
    color: "#032B77",
    marginHorizontal: 10,
  },
  modalFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
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
