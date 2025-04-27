import { View, StyleSheet, ActivityIndicator } from "react-native";
import { Stack } from "expo-router";
import { useState, useCallback, useEffect } from "react";
import RecordList from "../../../components/record/RecordList";
import RecordDateRange from "../../../components/record/RecordDateRange";
import RecordButton from "../../../components/common/RecordButton";
import { CATEGORIES, getCategoryByName } from "../../../constants/CategoryData";
import RecordAddModal from "../../../components/record/RecordAddModal";
import {
  getRecords,
  createTextRecord,
  updateRecord,
  deleteRecord,
} from "../../../api/record";
import { useMemberStore } from "../../../zustand/stores/member";
import { getKoreanToday } from "../../../hooks/utils/FormatForLocalDateTime";
import useParsedRecords from "../../../hooks/useParsedRecords";

// 날짜를 LocalDateTime 형식의 문자열로 변환 (startDate, endDate)
const formatDateToString = (date, isEndDate = false) => {
  if (!date) return "";
  const d = new Date(date);
  const utc = d.getTime() + d.getTimezoneOffset() * 60000;
  const kstDate = new Date(utc + 9 * 60 * 60 * 1000);

  const year = kstDate.getFullYear();
  const month = String(kstDate.getMonth() + 1).padStart(2, "0");
  const day = String(kstDate.getDate()).padStart(2, "0");

  // 종료 날짜인 경우 23:59:59, 시작 날짜인 경우 00:00:00
  const time = isEndDate ? "23:59:59" : "00:00:00";

  return `${year}-${month}-${day}T${time}`;
};

export default function RecordScreen() {
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [selectedDateRange, setSelectedDateRange] = useState({
    startDate: `${getKoreanToday()}T00:00:00`,
    endDate: `${getKoreanToday()}T23:59:59`,
  });
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [records, setRecords] = useState([]);
  const [selectedRecords, setSelectedRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pageInfo, setPageInfo] = useState({ page: 1, totalPages: 1 });
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { member } = useMemberStore();
  const today = getKoreanToday();

  const fetchRecords = async (pageNum, isRefresh = false) => {
    if (isLoading || (!isRefresh && pageInfo.page >= pageInfo.totalPages))
      return;

    setIsLoading(true);
    try {
      const categoryId =
        selectedCategory === "전체"
          ? 0
          : getCategoryByName(selectedCategory).categoryId;
      console.log("getRecords 파라미터", {
        pageNum,
        size: 20,
        startDate: selectedDateRange.startDate,
        endDate: selectedDateRange.endDate,
        categoryId,
      });
      const { data, pageInfo: newPageInfo } = await getRecords(
        pageNum,
        20,
        selectedDateRange.startDate,
        selectedDateRange.endDate,
        categoryId
      );

      if (isRefresh) {
        setRecords(data);
      } else {
        setRecords((prev) => [...prev, ...data]);
      }

      setPageInfo(newPageInfo);
    } catch (error) {
      console.error("Error fetching records:", error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchRecords(1, true);
  }, [selectedDateRange, selectedCategory]);

  const handleDateRangeChange = (range) => {
    setSelectedDateRange({
      startDate: formatDateToString(range.startDate, false),
      endDate: formatDateToString(range.endDate, true),
    });
    setPageInfo({ page: 1, totalPages: 1 });
  };

  const handleToggleSelectMode = () => {
    setIsSelectMode(!isSelectMode);
    setSelectedRecords([]);
  };

  const handleDelete = async () => {
    if (selectedRecords.length === 0) return;

    try {
      await Promise.all(
        selectedRecords.map((recordId) => deleteRecord(recordId))
      );
      setRecords((prev) =>
        prev.filter((record) => !selectedRecords.includes(record.record_id))
      );
      setSelectedRecords([]);
      setIsSelectMode(false);
    } catch (error) {
      console.error("Error deleting records:", error);
    }
  };

  const handleSave = async (recordData) => {
    try {
      const record = await createTextRecord(recordData);
      if (!record.recordDateTime) {
        record.recordDateTime = recordData.recordDateTime || "";
      }
      setRecords((prev) => [
        record,
        ...prev.filter(
          (r) => r && r.recordId && r.recordId !== record.recordId
        ),
      ]);
      setShowAddModal(false);
      return record;
    } catch (error) {
      console.error("Error creating record:", error);
      alert("기록 추가 중 오류가 발생했습니다.");
    }
  };

  const handleUpdateRecord = async (updatedRecord) => {
    try {
      const record = await updateRecord(updatedRecord.recordId, updatedRecord);
      if (!record.recordDateTime) {
        record.recordDateTime = updatedRecord.recordDateTime || "";
      }
      setRecords((prev) => [
        {
          ...record,
          categoryId: record.category?.categoryId ?? record.categoryId,
        },
        ...prev.filter(
          (r) => r && r.recordId && r.recordId !== record.recordId
        ),
      ]);
    } catch (error) {
      console.error("Error updating record:", error);
      alert("기록 수정 중 오류가 발생했습니다.");
    }
  };

  const handleLoadMore = () => {
    if (!isLoading && pageInfo.page < pageInfo.totalPages) {
      fetchRecords(pageInfo.page + 1);
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setPageInfo({ page: 1, totalPages: 1 });
    fetchRecords(1, true);
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
        records={records}
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
        initialCategory={selectedCategory}
        onLoadMore={handleLoadMore}
        onRefresh={handleRefresh}
        isLoading={isLoading}
        isRefreshing={isRefreshing}
        hasMore={pageInfo.page < pageInfo.totalPages}
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
