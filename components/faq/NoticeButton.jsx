import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function NoticeButton({ importance }) {
  if (importance) {
    return (
      <LinearGradient
        colors={['#82ACF1', '#1373E0']}
        style={styles.importantButton}
      >
        <Text style={styles.importantText}>공지</Text>
      </LinearGradient>
    );
  }

  return (
    <View style={styles.normalButton}>
      <Text style={styles.normalText}>공지</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  importantButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  normalButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    backgroundColor: '#F0F4FA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  importantText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
  normalText: {
    color: '#69BAFF',
    fontSize: 12,
    fontWeight: '500',
  },
});
