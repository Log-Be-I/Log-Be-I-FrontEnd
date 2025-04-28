import { View, StyleSheet } from "react-native";
import { Stack } from "expo-router";
import { useState, useEffect } from "react";
import RecordList from "../../../components/record/RecordList";
import RecordDateRange from "../../../components/record/RecordDateRange";
import RecordButton from "../../../components/common/RecordButton";
import RecordAddModal from "../../../components/record/RecordAddModal";
import {
  getRecords,
  createTextRecord,
  updateRecord,
  deleteRecord,
} from "../../../api/record";
import { useMemberStore } from "../../../zustand/stores/member";
import { getKoreanToday } from "../../../hooks/utils/FormatForLocalDateTime";
import { getCategoryByName } from "../../../constants/CategoryData";

const formatDateToString = (date, isEndDate = false) => {
  if (!date) return "";
  const d = new Date(date);
  const utc = d.getTime() + d.getTimezoneOffset() * 60000;
  const kstDate = new Date(utc + 9 * 60 * 60 * 1000);
  const year = kstDate.getFullYear();
  const month = String(kstDate.getMonth() + 1).padStart(2, "0");
  const day = String(kstDate.getDate()).padStart(2, "0");
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
  const [showAddedMessage, setShowAddedMessage] = useState(false);
  const { member } = useMemberStore();

  const fetchRecords = async (pageNum, isRefresh = false) => {
    if (isLoading || (!isRefresh && pageInfo.page >= pageInfo.totalPages))
      return;
    setIsLoading(true);
    try {
      const categoryId =
        selectedCategory === "전체"
          ? 0
          : getCategoryByName(selectedCategory).categoryId;
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
      console.error(error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchRecords(1, true);
  }, [selectedDateRange, selectedCategory]);

  const handleToggleSelectMode = () => {
    setIsSelectMode(!isSelectMode);
    setSelectedRecords([]);
  };

  const handleDelete = async () => {
    if (selectedRecords.length === 0) return;
    try {
      await Promise.all(selectedRecords.map((id) => deleteRecord(id)));
      setRecords((prev) =>
        prev.filter((record) => !selectedRecords.includes(record.recordId))
      );
      setSelectedRecords([]);
      setIsSelectMode(false);
      alert("✅ 삭제 완료했습니다.");
    } catch (error) {
      console.error(error);
      alert("❌ 일부 삭제 실패했습니다.");
    }
  };

  const handleSaveRecord = async (recordData) => {
    try {
      const newRecord = await createTextRecord(recordData);
      setRecords((prev) => [...prev, { ...newRecord, isNew: true }]);
      setShowAddModal(false);
      setShowAddedMessage(true);
      setTimeout(() => setShowAddedMessage(false), 2000);
      return newRecord;
    } catch (error) {
      console.error("Error saving record:", error);
      alert("기록 추가 실패했습니다.");
      return null;
    }
  };

  const handleUpdateRecord = async (updatedRecord) => {
    try {
      const updated = await updateRecord(updatedRecord.recordId, updatedRecord);
      setRecords((prev) =>
        prev.map((r) =>
          r.recordId === updated.recordId ? { ...r, ...updated } : r
        )
      );
    } catch (error) {
      console.error(error);
      alert("❌ 기록 수정 실패했습니다.");
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: "기록", headerShown: true }} />
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
        onRangeChange={(range) => {
          setSelectedDateRange({
            startDate: formatDateToString(range.startDate, false),
            endDate: formatDateToString(range.endDate, true),
          });
          setPageInfo({ page: 1, totalPages: 1 });
        }}
        isSelectMode={isSelectMode}
      />
      <RecordList
        records={records}
        selectedRecords={selectedRecords}
        onRecordSelect={(recordId) => {
          setSelectedRecords((prev) =>
            prev.includes(recordId)
              ? prev.filter((id) => id !== recordId)
              : [...prev, recordId]
          );
        }}
        isSelectMode={isSelectMode}
        onLoadMore={() => fetchRecords(pageInfo.page + 1)}
        onRefresh={() => fetchRecords(1, true)}
        isLoading={isLoading}
        isRefreshing={isRefreshing}
        hasMore={pageInfo.page < pageInfo.totalPages}
        showAddedMessage={showAddedMessage}
        onSaveRecord={handleUpdateRecord}
        onUpdateRecord={handleUpdateRecord} // ✅ 여기 추가 꼭!!
        selectedCategory={selectedCategory}
        onCategoryChange={(category) => {
          setSelectedCategory(category);
          setPageInfo({ page: 1, totalPages: 1 });
        }}
      />
      <RecordAddModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={handleSaveRecord}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    justifyContent: "flex-end",
    padding: 12,
    backgroundColor: "#fff",
  },
  headerRight: { flexDirection: "row", gap: 8 },
});
