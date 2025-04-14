import React, { useState } from 'react';
import { View, StyleSheet, Text, Switch } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Calendar } from 'react-native-calendars';
import DayInput from './DayInput';

export default function DateRangeSelector({ startDate, endDate, onDateRangeChange, disabled }) {
  const [startDate2, setStartDate] = useState(new Date(startDate));
  const [endDate2, setEndDate] = useState(new Date(endDate));
  const [showCalendar, setShowCalendar] = useState(false);
  const [markedDates, setMarkedDates] = useState({});
  const [dateType, setDateType] = useState(null); // 'start' or 'end'
  const [isAllDay, setIsAllDay] = useState(false);

  const updateMarkedDates = (start, end) => {
    const marks = {};
    const startStr = start.toISOString().split('T')[0];
    const endStr = end.toISOString().split('T')[0];

    if (startStr === endStr) {
      marks[startStr] = { selected: true, selectedColor: '#69BAFF' };
    } else {
      // 기간 표시
      const currentDate = new Date(start);
      console.log('currentDate', currentDate);
      while (currentDate <= end) {
        const dateStr = currentDate.toISOString().split('T')[0];
        marks[dateStr] = {
          marked: true,
          dotColor: '#69BAFF'
        };
        currentDate.setDate(currentDate.getDate() + 1);
      }
      // 시작일과 종료일 강조
      marks[startStr] = { ...marks[startStr], selected: true, selectedColor: '#69BAFF' };
      marks[endStr] = { ...marks[endStr], selected: true, selectedColor: '#69BAFF' };
    }
    setMarkedDates(marks);
  };

  const handleDateSelect = (day) => {
    const selectedDateTime = new Date(day.dateString);
    
    if (dateType === 'start') {
      selectedDateTime.setHours(startDate2.getHours());
      selectedDateTime.setMinutes(startDate2.getMinutes());
      setStartDate(selectedDateTime);
      
      // 선택된 시작일이 종료일보다 늦으면 종료일도 같이 변경
      if (selectedDateTime > endDate2) {
        setEndDate(selectedDateTime);
      }
      updateMarkedDates(selectedDateTime, selectedDateTime > endDate2 ? selectedDateTime : endDate2);
    } else if (dateType === 'end') {
      selectedDateTime.setHours(endDate2.getHours());
      selectedDateTime.setMinutes(endDate2.getMinutes());
      
      // 선택된 종료일이 시작일보다 이르면 무시
      if (selectedDateTime >= startDate2) {
        setEndDate(selectedDateTime);
        updateMarkedDates(startDate2, selectedDateTime);
      }
    }
    setShowCalendar(false);
  };

  const handleAllDayToggle = (value) => {
    setIsAllDay(value);
    if (value) {
      const start = new Date(startDate2);
      start.setHours(0, 0, 0, 0);
      const end = new Date(endDate2);
      end.setHours(23, 50, 0, 0);
      setStartDate(start);
      setEndDate(end);
      setShowCalendar(false);
    }
  };

  const handleStartDatePress = () => {
    setDateType('start');
    setShowCalendar(true);
    updateMarkedDates(startDate2, endDate2);
  };

  const handleEndDatePress = () => {
    setDateType('end');
    setShowCalendar(true);
    updateMarkedDates(startDate2, endDate2);
  };

  return (
    // 일정칸
    <View style={styles.container}>
      <View style={styles.allDayContainer}>
      <View style={styles.allDayLeft}>
            <Icon name="time-outline" size={24} color="#666" />
            <Text style={styles.allDayText}>하루종일</Text>
        <Switch
        trackColor={{
            true: '#69BAFF',
            false: '#E5E5E5',
        }}
        thumbColor={isAllDay ? '#69BAFF' : '#E5E5E5'}
        value={isAllDay}
        onValueChange={handleAllDayToggle}
        />
      </View>
      </View>
      <View style={styles.dateContainer}>
        <DayInput
          label="시작"
          date={startDate2}
          onDateChange={setStartDate}
          onPressDate={handleStartDatePress}
          onTimePress={() => setShowCalendar(false)}
        />
        <Icon name="arrow-forward" size={20} color="#666" style={styles.arrow} />
        <DayInput
          label="종료"
          date={endDate2}
          onDateChange={setEndDate}
          minimumDate={startDate2}
          onPressDate={handleEndDatePress}
          onTimePress={() => setShowCalendar(false)}
        />
      </View>

      {showCalendar && (
        <View style={styles.calendarContainer}>
          <Calendar
            current={dateType === 'start' ? startDate2.toISOString() : endDate2.toISOString()}
            minDate={dateType === 'end' ? startDate2.toISOString().split('T')[0] : undefined}
            onDayPress={handleDateSelect}
            markedDates={markedDates}
            style={styles.calendar}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 16,
    marginTop: 20,
  },
  allDayContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginLeft: 180,
},
  allDayLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
},
allDayText: {
  fontSize: 14,
  color: '#333',
  marginLeft: 4,
},
  dateContainer: {
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  arrow: {
    alignSelf: 'center',
    marginVertical: 8,
    marginHorizontal: 8,
    marginTop: 32,
  },
  calendarContainer: {
    marginBottom: 16,
  },
  calendar: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
}); 