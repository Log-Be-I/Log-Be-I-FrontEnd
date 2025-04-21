import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

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
      setExpanded(prev => !prev); // 일반 모드일 경우 펼침/닫힘힘
    }
  };

  return (
    <Pressable 
    style={[styles.card,
        isSelectMode && isSelected && styles.selected, // 선택된 상태면 스타일 추가가 
    ]} 
    onPress={handleCardPress}>
      <View style={styles.header}>
      {isSelectMode && (
          <Icon
            name={isSelected ? "checkbox" : "square-outline"}
            size={20}
            color="#2563ED"
            style={{ marginRight: 8 }}
          />
        )}
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
      </View>

      {(alwaysOpen || expanded) && (
        <View style={styles.contentContainer}>
          <Text style={styles.content}>{content}</Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  selected: {
    backgroundColor: '#E0F2FF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#5B75B1',
    marginLeft: 12,
    flex: 1,
  },
  contentContainer: {
    marginTop: 12,
  },
  content: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
  },
  chevron: {
    marginLeft: 8,
  },
});
