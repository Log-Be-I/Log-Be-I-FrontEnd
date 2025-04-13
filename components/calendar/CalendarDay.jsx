// components/CalendarDay.jsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function CalendarDay({ date, selected, onPress, hasEvent }) {
  const isSelected = selected === date.dateString;

  return (
    <TouchableOpacity
      onPress={() => onPress(date)}
      style={styles.container}
    >
      <View style={[
        styles.dayContainer,
        isSelected && styles.selectedDay
      ]}>
        <Text style={[
          styles.dayText,
          isSelected && styles.selectedDayText
        ]}>
          {date.day}
        </Text>
      </View>
      {hasEvent && (
        <View style={[
          styles.dot,
          isSelected && styles.selectedDot
        ]} />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 32,
    height: 48,
    margin: 2,
  },
  dayContainer: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
  },
  selectedDay: {
    backgroundColor: '#4A90E2',
  },
  dayText: {
    fontSize: 14,
    color: '#333',
  },
  selectedDayText: {
    color: 'white',
    fontWeight: '600',
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#69BAFF',
    marginTop: 4,
  },
  selectedDot: {
    backgroundColor: 'white',
  },
});
