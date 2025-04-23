import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export default function ReportItem({ title, content, onPress }) {
  return (
    <Pressable style={styles.container} onPress={onPress}>
      <View style={styles.titleRow}>
          <Icon name="document-text-outline" size={24} color="#69BAFF" />
          <View style={styles.separator} />
          <Text style={styles.title}>{title}</Text>
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.content}>{content}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 25, // 수직패딩으로 카드 높이 확보보
    marginHorizontal: 10,
    marginBottom: 20,
    //minHeight: 100, // 카드 높이 추가
    justifyContent: 'center', // 세로 중앙 정렬
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    //marginBottom: 12, // 여백 좀 더 줘서 안정감
  },
  separator: {
    width: 1,
    height: 24,
    backgroundColor: '#69BAFF',
    marginHorizontal: 12,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center', // 내용 세로 가운데 정렬
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#5B75B1',
  },
  content: {
    fontSize: 16,
    color: '#6C7A8A',
    lineHeight: 22,
  },
}); 