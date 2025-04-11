// components/sidebar/ReportItems.jsx
import { View, Text, StyleSheet } from 'react-native';

export default function ReportItems() {
  return (
    <View style={styles.items}>
      {/* 일상 분석 항목 */}
      <Text style={styles.item}>📊 나의 일상 분석</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  items: {
    flexDirection: 'column',
  },
  item: {
    padding: 10,
    backgroundColor: '#EEF4FF',
    borderRadius: 10,
    fontSize: 14,
  },
});
