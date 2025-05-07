import {
  View,
  SectionList,
  Animated,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { useState, useRef, useEffect, useMemo } from "react";
import RecordButton from "../common/RecordButton";
import RecordItem from "./RecordItem";
import RecordDetailModal from "./RecordDetailModal";
import { CATEGORIES } from "../../constants/CategoryData";
import useParsedRecords from "../../hooks/useParsedRecords";

const EmptyState = () => (
  <View style={styles.emptyContainer}>
    <Image
      source={require("../../assets/sullen_girokss.png")}
      style={styles.emptyImage}
      resizeMode="contain"
    />
    <Text style={styles.emptyText}>기록이 없어서 기록이가 슬퍼해요 ㅠㅠ</Text>
  </View>
);

export default function RecordList({
  records,
  selectedRecords,
  onRecordSelect,
  isSelectMode,
  onLoadMore,
  onRefresh,
  isLoading,
  isRefreshing,
  hasMore,
  showAddedMessage,
  onCategoryChange,
  onUpdateRecord,
  selectedCategory,
}) {
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [showUpdatedMessage, setShowUpdatedMessage] = useState(false);
  const scrollY = useRef(new Animated.Value(0)).current;
  const listRef = useRef(null);

  const parsedRecords = useParsedRecords(records);

  const sections = useMemo(() => {
    const groupedData = (parsedRecords || []).reduce((acc, record) => {
      const date = record.record_date;
      if (!acc[date]) acc[date] = [];
      acc[date].push(record);
      return acc;
    }, {});

    return Object.entries(groupedData)
      .sort(([dateA], [dateB]) => new Date(dateA) - new Date(dateB))
      .map(([date, data]) => ({
        title: date,
        data: data.sort((a, b) => a.record_time.localeCompare(b.record_time)),
      }));
  }, [parsedRecords]);

  const handleUpdateRecord = async (updatedData) => {
    try {
      await onUpdateRecord({
        ...updatedData,
        recordId: currentRecord.recordId,
      });
      setShowUpdatedMessage(true);
      setTimeout(() => setShowUpdatedMessage(false), 2000);
    } catch (error) {
      console.error("Error updating record", error);
      alert("기록 수정 실패했습니다.");
    }
  };

  const renderItem = ({ item }) => (
    <RecordItem
      record={item}
      onSelect={() => {
        if (isSelectMode) {
          onRecordSelect(item.recordId);
        } else {
          setCurrentRecord(item);
          setShowDetailModal(true);
        }
      }}
      isSelectMode={isSelectMode}
      isSelected={selectedRecords.includes(item.recordId)}
      isNew={item.isNew}
    />
  );

  const renderSectionHeader = ({ section }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionHeaderText}>{formatDate(section.title)}</Text>
    </View>
  );

  const ListFooter = () => {
    if (!isLoading || !hasMore) return null;
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="small" color="#69BAFF" />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryBar}
        contentContainerStyle={styles.categoryContent}
      >
        {["전체", ...CATEGORIES.map((c) => c.name)].map((cat) => (
          <Pressable
            key={cat}
            onPress={() => onCategoryChange(cat)}
            style={({ pressed }) => [
              styles.categoryButton,
              selectedCategory === cat && styles.categoryButtonSelected,
              pressed && { opacity: 0.7 },
            ]}
          >
            <Text
              style={
                selectedCategory === cat
                  ? styles.categoryTextSelected
                  : styles.categoryText
              }
            >
              {cat}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {showAddedMessage && (
        <Animated.View style={styles.addedMessageContainer}>
          <Text style={styles.addedMessageText}>✅ 기록이 추가되었습니다.</Text>
        </Animated.View>
      )}

      {showUpdatedMessage && (
        <Animated.View style={styles.addedMessageContainer}>
          <Text style={styles.addedMessageText}>✅ 기록이 수정되었습니다.</Text>
        </Animated.View>
      )}

      <SectionList
        ref={listRef}
        sections={sections}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        keyExtractor={(item) => item.recordId.toString()}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
        stickySectionHeadersEnabled
        ListEmptyComponent={EmptyState}
        ListFooterComponent={ListFooter}
        onEndReached={onLoadMore}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            colors={["#69BAFF"]}
          />
        }
        contentContainerStyle={[
          styles.listContent,
          sections.length === 0 && styles.emptyContent,
          { paddingBottom: 88 },
        ]}
      />

      <RecordDetailModal
        visible={showDetailModal}
        onClose={() => {
          setShowDetailModal(false);
          setCurrentRecord(null);
        }}
        record={currentRecord}
        onSave={handleUpdateRecord}
      />
    </View>
  );
}

const formatDate = (dateString) => {
  try {
    const [year, month, day] = dateString.split("-");
    return `${year}년 ${Number(month)}월 ${Number(day)}일`;
  } catch {
    return dateString;
  }
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  listContent: { flexGrow: 1 },
  emptyContent: { flex: 1, justifyContent: "center", alignItems: "center" },
  sectionHeader: {
    backgroundColor: "#F5F5F5",
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  sectionHeaderText: { fontSize: 14, fontWeight: "600", color: "#333333" },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyImage: { width: 200, height: 200, marginBottom: 16 },
  emptyText: { fontSize: 16, color: "#666666" },
  footer: { paddingVertical: 20, alignItems: "center" },
  addedMessageContainer: {
    position: "absolute",
    top: 10,
    alignSelf: "center",
    backgroundColor: "#69BAFF",
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
    zIndex: 10,
  },
  addedMessageText: { color: "white", fontWeight: "600", fontSize: 14 },
  categoryBar: {
    flexGrow: 0,
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
    backgroundColor: "#FFFFFF",
  },
  categoryContent: {
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    height: 30,
    marginBottom: 10,
  },
  categoryButton: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    marginHorizontal: 4,
    backgroundColor: "#F0F0F0",
  },
  categoryButtonSelected: {
    backgroundColor: "#69BAFF",
  },
  categoryText: {
    fontSize: 13,
    color: "#333333",
  },
  categoryTextSelected: {
    fontSize: 13,
    color: "white",
    fontWeight: "600",
  },
});
