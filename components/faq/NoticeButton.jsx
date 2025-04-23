import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function NoticeButton({ isPinned }) {
  if (isPinned === 'URGENT_PINNED') {
    return (
      <View style={styles.urgentButton}>
        <Text style={styles.urgentText}>긴급 공지</Text>
      </View>
    );
  }

  if (isPinned === 'PINNED') {
    return (
      <View style={styles.pinnedButton}>
        <Text style={styles.pinnedText}>중요 공지</Text>
      </View>
    );
  }
  // NONE 일 때 
  return (
    <View style={styles.normalButton}>
      <Text style={styles.normalText}>공지</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  urgentButton: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 12, // 가로 길이의 padding 확보
    paddingVertical: 8,
    borderRadius: 5,
    minWidth: 70, // 최소 가로 길이 확보
    alignItems: 'center',
  },
  urgentText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  pinnedButton: {
    backgroundColor: '#FFA94D',
    paddingHorizontal: 12, // 가로 길이의 padding 확보
    paddingVertical: 8,
    borderRadius: 5,
    minWidth: 70, // 최소 가로 길이 확보
    alignItems: 'center',
  },
  pinnedText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  normalButton: {
    backgroundColor: '#D1D5DB',
    paddingHorizontal: 12, // 가로 길이의 padding 확보
    paddingVertical: 8,
    borderRadius: 5,
    minWidth: 70, // 최소 가로 길이 확보
    alignItems: 'center',
  },
  normalText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
