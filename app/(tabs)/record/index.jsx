import { View, StyleSheet } from "react-native";
import { Stack } from "expo-router";
import { useState, useCallback, useEffect } from "react";
import RecordList from "../../../components/record/RecordList";
import RecordDateRange from "../../../components/record/RecordDateRange";
import RecordButton from "../../../components/common/RecordButton";
import { RECORDS } from "../../../constants/RecordDummyData";
import { CATEGORIES, CATEGORY_ICONS } from "../../../constants/CategoryData";

export default function RecordScreen() {
  const [selectedDateRange, setSelectedDateRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
  });
  const [isSelectMode, setIsSelectMode] = useState(false);

  const handleDateRangeChange = (range) => {
    setSelectedDateRange(range);
  };

  const handleToggleSelectMode = () => {
    setIsSelectMode(!isSelectMode);
  };

  const handleDelete = () => {
    // TODO: 삭제 기능 구현
    console.log("Delete items");
  };

  const handleNew = () => {
    // TODO: 새 기록 추가 기능 구현
    console.log("Add new record");
  };

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
            onPress={isSelectMode ? handleToggleSelectMode : handleNew}
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
        records={RECORDS.filter(
          (record) =>
            new Date(record.record_date) >=
              new Date(selectedDateRange.startDate.setHours(0, 0, 0, 0)) &&
            new Date(record.record_date) <=
              new Date(selectedDateRange.endDate.setHours(23, 59, 59, 999))
        )}
        selectedStartDate={selectedDateRange.startDate}
        isSelectMode={isSelectMode}
        onToggleSelectMode={handleToggleSelectMode}
        onDelete={handleDelete}
        onNew={handleNew}
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
