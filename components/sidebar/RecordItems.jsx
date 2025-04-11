// components/sidebar/RecordItems.jsx
import { View, Text, StyleSheet } from 'react-native';

export default function RecordItems() {
  return (
    <View style={styles.items}>
      <Text style={styles.item}>📘 나의 일상</Text>
      <Text style={styles.item}>💳 나의 소비</Text>
      <Text style={styles.item}>📅 나의 할 일</Text>
      <Text style={styles.item}>❤️ 나의 건강</Text>
      <Text style={styles.item}>➕ 그 외 활동</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  items: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  item: {
    padding: 6,
    backgroundColor: '#EEF4FF',
    borderRadius: 8,
    marginRight: 8,
    fontSize: 14,
  },
});
