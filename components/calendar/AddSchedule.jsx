import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Text, Switch } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Calendar } from 'react-native-calendars';
import DayInput from './DayInput';
import Button from '../../components/common/button';
import { createSchedule } from '../../api/schedule/scheduleApi';

export default function AddSchedule({ selectedDate = new Date(), onClose, onAdd }) {
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState(new Date(selectedDate));
  const [endDate, setEndDate] = useState(new Date(selectedDate));
  const [showCalendar, setShowCalendar] = useState(false);
  const [isAllDay, setIsAllDay] = useState(false);
  const [markedDates, setMarkedDates] = useState({});

  const handleDateSelect = (day) => {
    const selectedDateTime = new Date(day.dateString);
    selectedDateTime.setHours(startDate.getHours());
    selectedDateTime.setMinutes(startDate.getMinutes());

    if (!startDate || day.dateString === startDate.toISOString().split('T')[0]) {
      // 시작일을 선택하거나 같은 날짜를 선택한 경우
      setStartDate(selectedDateTime);
      setEndDate(selectedDateTime);
      setShowCalendar(false);
      setMarkedDates({
        [day.dateString]: { selected: true, selectedColor: '#69BAFF' }
      });
    } else {
      // 종료일을 선택한 경우
      setEndDate(selectedDateTime);
      setShowCalendar(false);

      // 기간 표시를 위한 마커 설정
      const start = new Date(startDate);
      const end = new Date(selectedDateTime);
      const marks = {};
      
      for (let date = start; date <= end; date.setDate(date.getDate() + 1)) {
        const dateString = date.toISOString().split('T')[0];
        marks[dateString] = {
          marked: true,
          dotColor: '#69BAFF'
        };
      }

      // 시작일과 종료일 강조
      marks[startDate.toISOString().split('T')[0]] = {
        ...marks[startDate.toISOString().split('T')[0]],
        selected: true,
        selectedColor: '#69BAFF'
      };
      marks[day.dateString] = {
        ...marks[day.dateString],
        selected: true,
        selectedColor: '#69BAFF'
      };

      setMarkedDates(marks);
    }
  };

  const handleAllDayToggle = (value) => {
    setIsAllDay(value);
    if (value) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      const end = new Date(endDate);
      end.setHours(23, 50, 0, 0);
      setStartDate(start);
      setEndDate(end);
    }
  };

  const handleAdd = async () => {
    try {
      const response = await createSchedule({ 
        title, 
        startDate, 
        endDate
    });
      if (onAdd) onAdd(response);
    } catch (error) {
      console.error('일정 추가 실패:', error);
    }
  };
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.titleInput}
        placeholder="일정"
        value={title}
        onChangeText={setTitle}
        autoFocus
      />
      
      <View style={styles.dateContainer}>
        <DayInput
          label="시작"
          date={startDate}
          onDateChange={setStartDate}
          onPressDate={() => setShowCalendar(true)}
          onTimePress={() => setShowTimePicker(false)}
        />
        <Icon name="arrow-forward" size={20} color="#666" style={styles.arrow} />
        <DayInput
          label="종료"
          date={endDate}
          onDateChange={setEndDate}
          minimumDate={startDate}
          onPressDate={() => {
            if (startDate) setShowCalendar(true);
          }}
          onTimePress={() => setShowTimePicker(false)}
        />
      </View>

      {showCalendar && (
        <View style={styles.calendarContainer}>
          <Calendar
            current={startDate.toISOString()}
            minDate={startDate.toISOString().split('T')[0]}
            onDayPress={handleDateSelect}
            markedDates={markedDates}
            style={styles.calendar}
          />
        </View>
      )}

      <View style={styles.allDayContainer}>
        <View style={styles.allDayLeft}>
            <Icon name="time-outline" size={24} color="#666" />
            <Text style={styles.allDayText}>하루종일</Text>
        </View>
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

      <View style={styles.buttonContainer}>
        <Button
          title="Cancel"
          onPress={onClose}
          style={[styles.button, styles.cancelButton]}
          textStyle={styles.cancelButtonText}
          size="large"
        />
        <Button
          title="Add"
          onPress={handleAdd}
          style={[styles.button, styles.addButton]}
          textStyle={styles.addButtonText}
          size="large"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 16,
  },
  titleInput: {
    fontSize: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    paddingVertical: 8,
    marginBottom: 16,
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
  allDayContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
    paddingHorizontal: 16,
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
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 24,
    left: 16,
    right: 16,
  },
  button: {
    flex: 1,
    marginHorizontal: 8,
  },
  cancelButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#FF9500',
  },
  addButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#69BAFF',
  },
  cancelButtonText: {
    color: '#FF9500',
  },
  addButtonText: {
    color: '#69BAFF',
  },
}); 