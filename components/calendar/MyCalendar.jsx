import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';
import EventList from './EventList';
import { mockSchedules } from './mockData';

export default function MyCalendar() {
  const [selected, setSelected] = useState('');
  const [markedDates, setMarkedDates] = useState({});
  const [selectedDaySchedules, setSelectedDaySchedules] = useState([]);

  useEffect(() => {
    // 마커 설정
    const marks = {};
    Object.keys(mockSchedules).forEach((date) => {
      marks[date] = {
        marked: true,
        dotColor: '#69BAFF',
      };
    });

    setMarkedDates(marks);
  }, []);

  useEffect(() => {
    if (selected) {
      // 선택된 날짜의 일정 설정
      setSelectedDaySchedules(mockSchedules[selected] || []);

      // 마커 업데이트
      setMarkedDates(prev => {
        const newMarkedDates = { ...prev };
        
        // 이전 선택 제거
        Object.keys(newMarkedDates).forEach(date => {
          if (newMarkedDates[date].selected) {
            delete newMarkedDates[date].selected;
            if (mockSchedules[date]) {
              newMarkedDates[date].dotColor = '#69BAFF';
            }
          }
        });

        // 새로운 선택 추가
        newMarkedDates[selected] = {
          ...newMarkedDates[selected],
          selected: true,
          dotColor: mockSchedules[selected] ? 'white' : undefined,
        };

        return newMarkedDates;
      });
    }
  }, [selected]);

  const handleDayPress = (day) => {
    setSelected(day.dateString);
  };

  return (
    <View style={styles.container}>
      <Calendar
        style={styles.calendar}
        onDayPress={handleDayPress}
        markedDates={markedDates}
        monthFormat={'yyyy년 MM월'}
      />
      <EventList schedules={selectedDaySchedules} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  calendar: {
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
});