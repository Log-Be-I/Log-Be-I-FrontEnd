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
} from "react-native";
import { useState, useRef, useEffect, useMemo } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import RecordButton from "../common/RecordButton";
import RecordItem from "./RecordItem";
import RecordDetailModal from "./RecordDetailModal";
import { CATEGORIES, getCategoryById } from "../../constants/CategoryData";
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
  selectedStartDate,
  isSelectMode,
  selectedRecords,
  onRecordSelect,
  onUpdateRecord,
  initialCategory = "전체",
  onLoadMore,
  onRefresh,
  isLoading,
  isRefreshing,
  pageInfo,
}) {
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [currentDate, setCurrentDate] = useState(null);
  const scrollY = useRef(new Animated.Value(0)).current;
  const listRef = useRef(null);
  const scrollHandler = useRef(
    Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
      useNativeDriver: false,
    })
  ).current;

  // records 파싱 hook 사용
  const parsedRecords = useParsedRecords(records);

  // 컴포넌트가 언마운트될 때 Animated.event 정리
  useEffect(() => {
    return () => {
      scrollY.setValue(0);
      if (scrollHandler) {
        scrollHandler.remove?.();
      }
    };
  }, []);

  // 리렌더 대비용 (URL 직접 입력 시 대응)
  useEffect(() => {
    setSelectedCategory(initialCategory);
  }, [initialCategory]);

  // 날짜별로 데이터 그룹화 및 섹션 생성을 useMemo로 최적화
  const sections = useMemo(() => {
    const groupedData = (parsedRecords || []).reduce((acc, record) => {
      const date = record.record_date;
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(record);
      return acc;
    }, {});

    return Object.entries(groupedData)
      .sort(([dateA], [dateB]) => new Date(dateB) - new Date(dateA))
      .map(([date, data]) => ({
        title: date,
        data: data.sort((a, b) => b.record_time.localeCompare(a.record_time)),
      }));
  }, [parsedRecords]);

  // 필터링된 섹션도 useMemo로 최적화
  const filteredSections = useMemo(() => {
    if (selectedCategory === "전체") {
      return sections;
    }

    const category = getCategoryByName(selectedCategory);
    return sections
      .map((section) => ({
        ...section,
        data: section.data.filter(
          (record) => record.categoryId === category.categoryId
        ),
      }))
      .filter((section) => section.data.length > 0);
  }, [sections, selectedCategory]);

  const selectAll = () => {
    const allIds = records.map((record) => record.record_id);
    setSelectedItems(allIds);
  };

  const toggleItemSelection = (id) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  const handleRecordPress = (record) => {
    if (isSelectMode) {
      onRecordSelect(record.record_id);
    } else {
      setSelectedRecord({
        ...record,
        recordId: record.record_id,
        recordDateTime: record.record_date + "T" + record.record_time,
        categoryId: record.categoryId,
      });
      setShowDetailModal(true);
    }
  };

  const handleSaveRecord = (updatedRecord) => {
    onUpdateRecord(updatedRecord);
    setShowDetailModal(false);
  };

  const handleEndReached = () => {
    if (!isLoading && pageInfo && pageInfo.page < pageInfo.totalPages) {
      onLoadMore();
    }
  };

  const renderCategories = () => (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.categoriesContainer}
      contentContainerStyle={styles.categoriesContent}
    >
      <RecordButton
        label="전체"
        onPress={() => setSelectedCategory("전체")}
        variant={selectedCategory === "전체" ? "primary" : "default"}
        size="small"
      />
      {CATEGORIES.map((category) => (
        <RecordButton
          key={category.categoryId}
          label={category.name}
          onPress={() => setSelectedCategory(category.name)}
          variant={selectedCategory === category.name ? "primary" : "default"}
          size="small"
        />
      ))}
    </ScrollView>
  );

  const renderSectionHeader = ({ section }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionHeaderText}>{formatDate(section.title)}</Text>
    </View>
  );

  const renderItem = ({ item }) => {
    const isSelected = selectedRecords?.includes(item.record_id);

    return (
      <RecordItem
        record={item}
        onSelect={() => handleRecordPress(item)}
        isSelectMode={isSelectMode}
        isSelected={isSelected}
      />
    );
  };

  const ListFooter = () => {
    if (!isLoading || !(pageInfo && pageInfo.page < pageInfo.totalPages))
      return null;
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="small" color="#69BAFF" />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.categoriesWrapper}>{renderCategories()}</View>
      <View style={styles.listContainer}>
        <SectionList
          ref={listRef}
          sections={filteredSections}
          renderItem={renderItem}
          renderSectionHeader={renderSectionHeader}
          keyExtractor={(item) => item.recordId}
          onScroll={scrollHandler}
          scrollEventThrottle={16}
          stickySectionHeadersEnabled={true}
          ListEmptyComponent={EmptyState}
          ListFooterComponent={ListFooter}
          onEndReached={handleEndReached}
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
            filteredSections.length === 0 && styles.emptyContent,
          ]}
        />
      </View>
      <RecordDetailModal
        visible={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        record={selectedRecord}
        onSave={handleSaveRecord}
      />
    </View>
  );
}

const formatDate = (dateString) => {
  try {
    const [year, month, day] = dateString.split("-");
    return `${year}년 ${Number(month)}월 ${Number(day)}일`;
  } catch (error) {
    console.error("Date formatting error:", error);
    return dateString;
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  categoriesWrapper: {
    height: 44,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
    backgroundColor: "#FFFFFF",
  },
  categoriesContainer: {
    height: "100%",
  },
  categoriesContent: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    gap: 8,
    flexDirection: "row",
  },
  sectionHeader: {
    backgroundColor: "#F5F5F5",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },
  sectionHeaderText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333333",
  },
  listContainer: {
    flex: 1,
  },
  listContent: {
    flexGrow: 1,
  },
  emptyContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyImage: {
    width: 200,
    height: 200,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    color: "#666666",
  },
  footer: {
    paddingVertical: 20,
    alignItems: "center",
    height: 100,
  },
});
