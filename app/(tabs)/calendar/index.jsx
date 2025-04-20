import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import { getAllSchedules } from '../../../api/schedule/scheduleApi';
import { useFocusEffect } from '@react-navigation/native';

import CalendarBody from '../../../components/calendar/CalendarBody';
import ScheduleComponent from '../../../components/calendar/ScheduleComponent';
import { Holidays } from '../../../dummyData/Holidays';


export default function MyCalendar() {
  const router = useRouter();
  const [selected, setSelected] = useState(new Date().toISOString().split('T')[0]);
  const [markedDates, setMarkedDates] = useState({});
  const [selectedDaySchedules, setSelectedDaySchedules] = useState([]);
  const [allSchedules, setAllSchedules] = useState(null);

  const fetchSchedules = async () => {
    try {
      const now = new Date();
      const data = await getAllSchedules(now.getFullYear(), now.getMonth() + 1);
      const safeDate = selected || new Date().toISOString().split('T')[0];
      //data를 날짜별로 묶는 형태로 가공해야 한다.
      const formatted = {};
      const marks = {};
      data?.data?.forEach((item) => {
        const start = new Date(item.startDateTime);
        const end = new Date(item.endDateTime);
        const current = new Date(start);

        while (current <= end) {
          const dateKey = current.toISOString().split('T')[0]; // ex) '2025-04-20'

          // 날짜 일정 목록 구성
          if (!formatted[dateKey]) formatted[dateKey] = [];
          formatted[dateKey].push({
            id: item.id,
            title: item.title,
            startDateTime: item.startDateTime,
            endDateTime: item.endDateTime,
            calendarId: item.calendarId,
          });

          // 마커 설정
          marks[dateKey] = {
            marked: true,
            dotColor: '#69BAFF',
          };

          current.setDate(current.getDate() + 1);
        }
      });

      // 공휴일 마커 추가
      Object.keys(Holidays).forEach((date) => {
        marks[date] = {
          ...(marks[date] || {}),
          marked: true,
          dotColor: '#FF4B4B',
        };

      // 공휴일을 일정으로 포함
      if(!formatted[date]) formatted[date] = [];
      formatted[date].push({
        title: Holidays[date].name,
        startDateTime: `${date}T12:00:00`,
        endDateTime: `${date}T23:50:00`,
        isHoliday: true,
      });
    });

      //마커 설정
        marks[safeDate] = {
        ...(marks[safeDate] || {}),
        selected: true,
        dotColor: formatted[safeDate] ? 'white' : '#69BAFF',
      };

      setAllSchedules(formatted);
      // 선택된 날짜의 일정 리스트를 ScheduleComponent에 전달
      setSelectedDaySchedules(formatted[safeDate] || []);
      setMarkedDates(marks);

    } catch (error) {
      console.error('일정 조회 실패:', error);
    }
  };

// expo-router에서 페이지가 포커싱될 때마다 재요청
  useFocusEffect(
    useCallback(() => {
      fetchSchedules();
    }, []) // selected를 넣어 날짜가 바뀔때마다 조회된다. 최초만 하고 싶다면 제거하자!
  );

  
  // useEffect(() => {
  //   // 마커 설정
  //   const marks = {};
  //   Object.keys(mockSchedules).forEach((date) => {
  //     marks[date] = {
  //       marked: true,
  //       dotColor: '#69BAFF',
  //     };
  //   });

  //   setMarkedDates(marks);
  // }, []);

  useEffect(() => {
    if (!allSchedules)  return
      // 선택된 날짜의 일정 설정
      setSelectedDaySchedules(allSchedules[selected] || []);
      // // 마커 업데이트
      // setMarkedDates(prev => {
      //   const newMarkedDates = { ...prev };
        
      //   // 이전 선택 제거
      //   Object.keys(newMarkedDates).forEach(date => {
      //     if (newMarkedDates[date].selected) {
      //       delete newMarkedDates[date].selected;
      //       // if (mockSchedules[date]) {
      //       //   newMarkedDates[date].dotColor = '#69BAFF';
      //       // }
      //     }
      //   });

      //   // 새로운 선택 추가
      //   newMarkedDates[selected] = {
      //     ...(newMarkedDates[selected] || {}),
      //     selected: true,
      //     dotColor: allSchedules[selected] ? 'white' : '#69BAFF',
      //   };

      //   return newMarkedDates;
      // });
  }, [selected, allSchedules]);

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
          schedules={selectedDaySchedules}
        />
      </View>

      {/* 일정 리스트 컴포넌트 */}
      <View style={styles.scheduleWrapper}>
      {/* <EventList schedules={selectedDaySchedules} onPress={handleSchedulePress} /> */}
        <ScheduleComponent 
        schedules={selectedDaySchedules} 
        onPress={handleSchedulePress} 
        selectedDate={selected}
        />
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