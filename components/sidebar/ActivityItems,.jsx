// components/sidebar/ActivityItems.jsx
import { View, Text, StyleSheet } from 'react-native';

export default function ActivityItems() {
  return (
    <View style={styles.items}>
      {/* 오늘의 이슈 항목 */}
      <Text style={styles.item}>❗ 오늘의 이슈</Text>

      {/* 나의 QnA 항목 */}
      <Text style={styles.item}>💬 나의 QnA</Text>

      {/* 자주 하는 질문 항목 */}
      <Text style={styles.item}>🌟 자주 하는 질문</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  items: {
    flexDirection: 'column', // 세로 정렬
    gap: 8,                  // 각 항목 사이 간격
  },
  item: {
    padding: 10,
    backgroundColor: '#EEF4FF', // 연한 파랑 배경
    borderRadius: 10,
    fontSize: 14,
  },
});
