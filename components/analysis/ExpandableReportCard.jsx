import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

export default function ExpandableReportCard({
  title,
  content,
  alwaysOpen = false,
  isSelectMode = false,
  isSelected = false,
  onToggleSelect = () => {},
}) {
  const [expanded, setExpanded] = useState(false);

  const handleCardPress = () => {
    if (isSelectMode) {
      onToggleSelect(!isSelected); // 선택모드일 경우 체크 변경
    } else {
      setExpanded((prev) => !prev); // 일반 모드일 경우 펼침/닫힘힘
    }
  };

  return (
    <Pressable
      style={[
        styles.card,
        isSelected && styles.selected, // 선택된 상태면 스타일 추가가
      ]}
      onPress={handleCardPress}
    >
      <View style={styles.header}>
        {isSelectMode && (
          <Pressable
            onPress={() => onToggleSelect(!isSelected)}
            style={styles.checkboxArea}
          >
            <Icon
              name={isSelected ? "checkbox" : "square-outline"}
              size={20}
              color="#2563ED"
              style={{ marginRight: 8 }}
            />
          </Pressable>
        )}
        {/* 나머지 영역 누르면 펼침/접힘 */}
        <Pressable
          onPress={() => !alwaysOpen && setExpanded((prev) => !prev)}
          style={styles.expandArea}
        >
          <Icon name="document-text-outline" size={20} color="#69BAFF" />
          <Text style={styles.title}>{title}</Text>
          {!alwaysOpen && !isSelectMode && (
            <Icon
              name={expanded ? "chevron-up-outline" : "chevron-down-outline"}
              size={20}
              color="#999"
              style={styles.chevron}
            />
          )}
        </Pressable>
      </View>

      {(alwaysOpen || expanded) && (
        <View style={styles.contentContainer}>
          {typeof content === "object" ? (
            <>
              {content.summary && <Text style={styles.sectionTitle}>요약</Text>}
              {content.summary && (
                <Text style={styles.sectionContent}>{content.summary}</Text>
              )}

              {content.emotionRatio && (
                <Text style={styles.sectionTitle}>감정 비율</Text>
              )}
              {content.emotionRatio && (
                <Text style={styles.sectionContent}>
                  {content.emotionRatio}
                </Text>
              )}

              {content.insight && (
                <Text style={styles.sectionTitle}>인사이트</Text>
              )}
              {content.insight && (
                <Text style={styles.sectionContent}>{content.insight}</Text>
              )}

              {content.suggestion && (
                <Text style={styles.sectionTitle}>제안</Text>
              )}
              {content.suggestion && (
                <Text style={styles.sectionContent}>{content.suggestion}</Text>
              )}

              {content.categoryStat && (
                <Text style={styles.sectionTitle}>카테고리 통계</Text>
              )}
              {content.categoryStat && (
                <Text style={styles.sectionContent}>
                  {content.categoryStat}
                </Text>
              )}

              {content.pattern && (
                <Text style={styles.sectionTitle}>기록 패턴</Text>
              )}
              {content.pattern && (
                <Text style={styles.sectionContent}>{content.pattern}</Text>
              )}
            </>
          ) : (
            <Text style={styles.content}>{content}</Text>
          )}
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  selected: {
    backgroundColor: "#E0F2FF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkboxArea: {
    marginRight: 8,
    justifyContent: "center",
    alignItems: "center",
    padding: 8,
  },
  expandArea: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#5B75B1",
    marginLeft: 12,
    flex: 1,
  },
  contentContainer: {
    marginTop: 12,
  },
  content: {
    fontSize: 14,
    color: "#4B5563",
    lineHeight: 20,
  },
  chevron: {
    marginLeft: 8,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#2563EB", // 약간 진한 블루
    marginTop: 8,
    marginBottom: 4,
  },
  sectionContent: {
    fontSize: 14,
    color: "#4B5563",
    marginBottom: 8,
    lineHeight: 20,
  },
});
