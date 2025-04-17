import { View, StyleSheet } from "react-native";
import { Stack } from "expo-router";
import { useState, useCallback, useEffect } from "react";
import RecordList from "../../../components/record/RecordList";
import RecordDateRange from "../../../components/record/RecordDateRange";
import RecordButton from "../../../components/common/RecordButton";
import { RECORDS } from "../../../constants/RecordDummyData";
import { CATEGORIES, CATEGORY_ICONS } from "../../../constants/CategoryData";
import RecordAddModal from "../../../components/record/RecordAddModal";

export default function RecordScreen() {
  const [selectedDateRange, setSelectedDateRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
  });
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [records, setRecords] = useState(RECORDS);
  const [selectedRecords, setSelectedRecords] = useState([]);

  const handleDateRangeChange = (range) => {
    setSelectedDateRange(range);
  };

  const handleToggleSelectMode = () => {
    setIsSelectMode(!isSelectMode);
    setSelectedRecords([]); // 선택 모드 종료 시 선택된 기록 초기화
  };

  const handleDelete = () => {
    if (selectedRecords.length === 0) return;

    // 선택된 기록들을 제외한 나머지 기록들만 남김
    const updatedRecords = records.filter(
      (record) => !selectedRecords.includes(record.record_id)
    );

    setRecords(updatedRecords);
    setSelectedRecords([]); // 선택된 기록 초기화
    setIsSelectMode(false); // 선택 모드 종료
  };

  const handleSave = (recordData) => {
    // API 요청 로직 추가 예정 기록 추가
    const newRecord = {
      record_id: Date.now().toString(), // 임시 ID 생성
      ...recordData,
    };
    setRecords([newRecord, ...records]);
    setShowAddModal(false);
  };

  const handleUpdateRecord = (updatedRecord) => {
    setRecords(
      records.map((record) =>
        record.record_id === updatedRecord.record_id ? updatedRecord : record
      )
    );
  };

  // 날짜 범위에 맞는 기록만 필터링
  const filteredRecords = records.filter(
    (record) =>
      new Date(record.record_date) >=
        new Date(selectedDateRange.startDate.setHours(0, 0, 0, 0)) &&
      new Date(record.record_date) <=
        new Date(selectedDateRange.endDate.setHours(23, 59, 59, 999))
  );

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "기록",
          headerShown: true,
        }}
      />
      <View style={styles.header}>
        <View style={styles.headerRight}>
          <RecordButton
            label={isSelectMode ? "삭제" : "선택"}
            onPress={isSelectMode ? handleDelete : handleToggleSelectMode}
            variant={isSelectMode ? "danger" : "primary"}
            size="small"
          />
          <RecordButton
            label={isSelectMode ? "취소" : "추가"}
            onPress={
              isSelectMode
                ? handleToggleSelectMode
                : () => setShowAddModal(true)
            }
            variant="default"
            size="small"
          />
        </View>
      </View>
      <RecordDateRange
        onRangeChange={handleDateRangeChange}
        isSelectMode={isSelectMode}
      />
      <RecordList
        records={filteredRecords}
        selectedStartDate={selectedDateRange.startDate}
        isSelectMode={isSelectMode}
        selectedRecords={selectedRecords}
        onRecordSelect={(recordId) => {
          setSelectedRecords((prev) =>
            prev.includes(recordId)
              ? prev.filter((id) => id !== recordId)
              : [...prev, recordId]
          );
        }}
        onUpdateRecord={handleUpdateRecord}
      />
      <RecordAddModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={handleSave}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  headerRight: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
});
