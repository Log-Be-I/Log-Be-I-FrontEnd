import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { format, isSameMonth, isSameDay, isWeekend } from 'date-fns';
import { Holidays } from '../../dummyData/Holidays';

export default function CalendarDay({ date, currentDate, selectedDate, onSelectDate, schedules }) {
  if (!date) return <View style={styles.dayContainer} />;

  const isToday = isSameDay(date, new Date());
  const isSelected = isSameDay(date, selectedDate);
  const isCurrentMonth = isSameMonth(date, currentDate);
  const isSunday = date.getDay() === 0;
  const isSaturday = date.getDay() === 6;

  const dateString = format(date, 'yyyy-MM-dd');
  const holydayInfo = Holidays[dateString];
  const isHoliday = !!holydayInfo;
  //const holidayName = holydayInfo?.name || '';
  
 // // 일정 있는 날 체크
 // const hasSchedule = Array.isArray(schedules) && schedules.some(schedule => {
 //   const scheduleDate = new Date(schedule.date);
 //   return isSameDay(date, scheduleDate);
 // });

 // 일정 있는 날 체크 (key 기반)
  const hasSchedule = Array.isArray(schedules[dateString]) && schedules[dateString].length > 0;

  const getDayColor = () => {
    if (!isCurrentMonth) return '#D1D5DB';
    if (isSelected) return '#fff'; // 선택된 날짜는 흰색 텍스트
    if (isHoliday || isSunday) return '#FF4B4B'; // 공휴일 또는 일요일
    if (isSaturday) return '#4B75FF'; // 토요일
    if (isToday) return '#69BAFF'; // 오늘 날짜
    return '#000'; // 기본 텍스트 색
  };

  const getDotColor = () => {
    if(isHoliday) return 'red';
    if(hasSchedule) return isSelected ? 'white' : '#69BAFF';
    //return isSelected ? 'white' : '#69BAFF';
    return 'transparent';
  }

  return (
    <TouchableOpacity
      style={[
        styles.dayContainer,
        isSelected && styles.selectedDay, // 선택한 날짜 배경
      ]}
      onPress={() => onSelectDate(date)}
    >
      <Text
        style={[
          styles.dayText, // 오늘 날짜 텍스트 파란색
          { color: getDayColor() },
        ]}
      >
        {format(date, 'd')}
      </Text>
      {isHoliday
        //<Text style={styles.holidayText} numberOfLines={1}>
          //{holidayName}
        //</Text>
      }
      <View style = {[styles.dotWrapper]}>
        {(isHoliday || hasSchedule) && (
        <View style={[styles.dot, {backgroundColor: getDotColor() }]} />
      )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  dayContainer: {
    flex: 1,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 2,
  },
  selectedDay: {
    backgroundColor: '#69BAFF',
    borderRadius: 999,
    width: 28,
    height: 28,
  },
  dayText: {
    fontSize: 14,
    color: '#000',
    textAlign: 'center',
  },
  todayText: {
    color: '#69BAFF',
    fontWeight: 'bold',
  },
  selectedDayText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  otherMonthText: {
    color: '#D1D5DB',
  },
  sundayText: {
    color: 'red',
  },
  saturdayText: {
    color: 'blue',
  },
  holidayText: {
    color: 'red',
    fontSize: 10,
    marginTop: 2,
  },
  dotWrapper: {
    height: 6, // 항상 공간 확보
    marginTop: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    //backgroundColor: '#69BAFF',
    marginTop: 2,
  },
});
