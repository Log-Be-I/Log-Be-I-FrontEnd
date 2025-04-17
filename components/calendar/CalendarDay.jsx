// components/CalendarDay.jsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function CalendarDay({ date, selected, onPress, hasEvent, isHoliday, holidayName }) {
  const isToday = date.dateString === new Date().toISOString().split('T')[0];
  const isSelected = (selected ?? isToday) === date.dateString;
  const dayOfWeek = new Date(date.dateString).getDay();
  const isSunday = dayOfWeek === 0;
  const isSaturday = dayOfWeek === 6;

  return (
    <TouchableOpacity
      onPress={() => onPress(date)}
      style={styles.container}
    >
      <View style={[
        styles.dayContainer,
        isSelected && styles.selectedDay,
      ]}>
        <Text style={[
          styles.dayText,
          isToday && styles.todayText,
          isSunday && styles.sundayText,
          isSaturday && styles.saturdayText,
          isHoliday && styles.holidayText,
          isSelected && styles.selectedDayText,
        ]}>
          {date.day}
        </Text>
      </View>
      {(hasEvent || isHoliday) && (
        <View style={[
          styles.dot,
          isHoliday && styles.holidayDot,
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
    backgroundColor: '#69BAFF',
  },
  dayText: {
    fontSize: 14,
    color: '#333',
  },
  todayText: {
    color: '#69BAFF',
    fontWeight: '600',
  },
  sundayText: {
    color: '#FF4B4B',
  },
  saturdayText: {
    color: '#4B75FF',
  },
  holidayText: {
    color: '#FF4B4B',
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
  holidayDot: {
    backgroundColor: 'orange',
  },
  selectedDot: {
    backgroundColor: 'white',
  },
});
