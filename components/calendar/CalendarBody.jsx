import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, parseISO } from 'date-fns';
import CalendarDay from './CalendarDay';
//import { getAllSchedules } from '../../api/schedule/scheduleApi';
import { Holidays } from '../../dummyData/Holidays';
import { mockSchedules } from './mockData';

export default function CalendarBody ({ selected, onDayPress}) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [schedules, setSchedules] = useState([]);

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    try {
      //const response = await getAllSchedules();
      //setSchedules(response.data);
      setSchedules(mockSchedules);
    } catch (error) {
      console.error('일정을 불러오는데 실패했습니다:', error);
    }
  };

  const onPrevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const onNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const getDaysInMonth = () => {
    const start = startOfMonth(currentDate);
    const end = endOfMonth(currentDate);
    return eachDayOfInterval({ start, end });
  };

  // const handleDayPress = (day) => {
  //   setSelectedDate(day.dateString);
  //   onDayPress?.({ dateString: format(day.date, 'yyyy-MM-dd') });
  // };
  const handleSelectDate = (date) => {
    setSelectedDate(date); // 내부 선택 상태 업데이트
    onDayPress?.({ dateString: format(date, 'yyyy-MM-dd') }); // 외부 콜백 호출
    if (!isSameMonth(date, currentDate)) {
      setCurrentDate(date);
    }
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity onPress={onPrevMonth}>
        <Text style={[styles.headerButton, {color: '#69BAFF'}]}>{'<'}</Text>
      </TouchableOpacity>
      <Text style={[styles.headerTitle, {color: '#5B75B1'}]}>
        {format(currentDate, 'yyyy년 MM월')}
      </Text>
      <TouchableOpacity onPress={onNextMonth}>
        <Text style={[styles.headerButton, {color: '#69BAFF'}]}>{'>'}</Text>
      </TouchableOpacity>
    </View>
  );

  const renderDays = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return (
      <View style={styles.daysRow}>
        {days.map((day, index) => (
          <Text
            key={day}
            style={[
              styles.dayLabel,
              index === 0 ? styles.sundayLabel : null,
              index === 6 ? styles.saturdayLabel : null,
            ]}
          >
            {day}
          </Text>
        ))}
      </View>
    );
  };

  const renderCalendar = () => {
    const days = getDaysInMonth();
    const firstDayOfMonth = startOfMonth(currentDate).getDay();
    const weeks = [];
    let week = new Array(7).fill(null);
    
    // 이전 달의 날짜 채우기
    for (let i = 0; i < firstDayOfMonth; i++) {
      const prevDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), -firstDayOfMonth + i + 1);
      week[i] = prevDate;
    }

    days.forEach((day, index) => {
      const weekDay = (firstDayOfMonth + index) % 7;
      week[weekDay] = day;
      
      if (weekDay === 6) {
        weeks.push([...week]);
        week = new Array(7).fill(null);
      }
    });

    // 마지막 주 채우기
    if (week.some(day => day !== null)) {
      let nextMonthDay = 1;
      for (let i = 0; i < 7; i++) {
        if (!week[i]) {
          week[i] = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, nextMonthDay++);
        }
      }
      weeks.push(week);
    }

    return weeks.map((week, weekIndex) => (
      <View key={weekIndex} style={styles.week}>
        {week.map((day, dayIndex) => (
          <CalendarDay
            key={dayIndex}
            date={day}
            currentDate={currentDate}
            selectedDate={selectedDate}
            onSelectDate={handleSelectDate}
            schedules={schedules} // 전체 일정 리스트
            holidays={Holidays}
          />
        ))}
      </View>
    ));
  };

  return (
    <View style={styles.container}>
      {renderHeader()}
      {renderDays()}
      {renderCalendar()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    //paddingVertical: 10,
  },
  headerButton: {
    fontSize: 20,
    padding: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  daysRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  dayLabel: {
    flex: 1,
    textAlign: 'center',
    fontSize: 14,
  },
  sundayLabel: {
    color: 'red',
  },
  saturdayLabel: {
    color: 'blue',
  },
  week: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});
