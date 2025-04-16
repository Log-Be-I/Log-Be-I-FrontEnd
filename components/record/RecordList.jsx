import {
  View,
  SectionList,
  Animated,
  Text,
  StyleSheet,
  Image,
  ScrollView,
} from "react-native";
import { useState, useRef, useEffect } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import RecordButton from "../common/RecordButton";
import RecordItem from "./RecordItem";
import RecordDetailModal from "./RecordDetailModal";
import { CATEGORIES, CATEGORY_ICONS } from "../../constants/CategoryData";

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
  onToggleSelectMode,
  onDelete,
  onNew,
}) {
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const scrollY = useRef(new Animated.Value(0)).current;

  // 날짜별로 데이터 그룹화
  const groupedData = records.reduce((acc, record) => {
    const date = record.record_date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(record);
    return acc;
  }, {});

  // SectionList 형식으로 데이터 변환
  const sections = Object.entries(groupedData)
    .sort(([dateA], [dateB]) => new Date(dateA) - new Date(dateB))
    .map(([date, data]) => ({
      title: date,
      data: data.sort((a, b) => new Date(a.time) - new Date(b.time)),
    }));

  const filteredSections = selectedCategory
    ? sections
        .map((section) => ({
          ...section,
          data: section.data.filter(
            (record) => record.category_id === selectedCategory
          ),
        }))
        .filter((section) => section.data.length > 0)
    : sections;

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
      toggleItemSelection(record.record_id);
    } else {
      setSelectedRecord(record);
      setShowDetailModal(true);
    }
  };

  const handleSaveRecord = (updatedRecord) => {
    // TODO: 실제 데이터 업데이트 로직 구현
    console.log("Updated record:", updatedRecord);
    setShowDetailModal(false);
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
        onPress={() => setSelectedCategory(null)}
        variant={selectedCategory === null ? "primary" : "default"}
        size="small"
      />
      {CATEGORIES.map((category) => (
        <RecordButton
          key={category.category_id}
          label={category.name}
          onPress={() => setSelectedCategory(category.category_id)}
          variant={
            selectedCategory === category.category_id ? "primary" : "default"
          }
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

  const renderItem = ({ item, index, section }) => {
    const isFirstItem = index === 0;
    const categoryInfo = CATEGORIES.find(
      (cat) => cat.category_id === item.category_id
    );
    return (
      <View style={isFirstItem && styles.firstItemContainer}>
        <RecordItem
          key={item.record_id}
          id={item.record_id}
          category={categoryInfo.name}
          categoryInfo={CATEGORY_ICONS[categoryInfo.name]}
          time={item.record_time}
          content={item.content}
          writeTime={item.record_date}
          isSelectMode={isSelectMode}
          isSelected={selectedItems.includes(item.record_id)}
          onSelect={() => handleRecordPress(item)}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.categoriesWrapper}>{renderCategories()}</View>
      <View style={styles.listContainer}>
        <SectionList
          sections={filteredSections}
          renderItem={renderItem}
          renderSectionHeader={renderSectionHeader}
          keyExtractor={(item) => item.record_id}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            {
              useNativeDriver: false,
            }
          )}
          scrollEventThrottle={16}
          ListEmptyComponent={EmptyState}
          contentContainerStyle={[
            styles.listContentContainer,
            filteredSections.length === 0 && styles.emptyContentContainer,
          ]}
          stickySectionHeadersEnabled={true}
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
  const date = new Date(dateString);
  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
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
    backgroundColor: "#F8F9FA",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  sectionHeaderText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#666666",
  },
  listContainer: {
    flex: 1,
  },
  listContentContainer: {
    flexGrow: 1,
  },
  emptyContentContainer: {
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
    fontWeight: "500",
  },
  firstItemContainer: {
    paddingTop: 8,
  },
});
