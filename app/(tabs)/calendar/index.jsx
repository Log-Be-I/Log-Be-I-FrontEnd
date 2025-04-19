import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { mockSchedules } from '../../../components/calendar/mockData';
import { useRouter } from 'expo-router';
import CalendarBody from '../../../components/calendar/CalendarBody';
import ScheduleComponent from '../../../components/calendar/ScheduleComponent';

export default function MyCalendar() {
  const router = useRouter();
  const [selected, setSelected] = useState(new Date().toISOString().split('T')[0]);
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

  const handleAddSchedule = () => {
    router.push({
      pathname: "/(tabs)/calendar/addSchedule",
      params: {
        selectedDate: selected // 선택된 날짜를 params로 전달
      }
    });
  };

  const handleSchedulePress = (schedule) => {
    router.push({
      pathname: "/(tabs)/calendar/editSchedule",
      params: {
        schedule: JSON.stringify(schedule) // 객체 그대로는 안넘겨진다. 문자열로 직렬화가 피요하다. 
      }
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.calendarWrapper}>
        <CalendarBody
          selected={selected}
          onDayPress={handleDayPress}
          markedDates={markedDates}
        />
      </View>

      {/* 일정 리스트 컴포넌트 */}
      <View style={styles.scheduleWrapper}>
      {/* <EventList schedules={selectedDaySchedules} onPress={handleSchedulePress} /> */}
        <ScheduleComponent 
        schedules={selectedDaySchedules} 
        onPress={handleSchedulePress} />
      </View>

      {/* 일정 추가 버튼 */}
      <TouchableOpacity style={styles.addButton} onPress={handleAddSchedule}>
        <Icon name="add" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    //padding: 0,
  },
  calendarWrapper: {
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    paddingBottom: 10,
  },
  scheduleWrapper: {
    flex: 1, // 리스트가 남은 공간을 차지하게
    paddingHorizontal: 10,
  },
  calendar: {
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  addButton: {
    position: 'absolute',
    right: 20,
    bottom: 70,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#4A90E2',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});