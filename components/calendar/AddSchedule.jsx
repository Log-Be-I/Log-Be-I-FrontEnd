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
  const [dateType, setDateType] = useState(null); // 'start' or 'end'

  const updateMarkedDates = (start, end) => {
    const marks = {};
    const startStr = start.toISOString().split('T')[0];
    const endStr = end.toISOString().split('T')[0];

    if (startStr === endStr) {
      marks[startStr] = { selected: true, selectedColor: '#69BAFF' };
    } else {
      // 기간 표시
      const currentDate = new Date(start);
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
      selectedDateTime.setHours(startDate.getHours());
      selectedDateTime.setMinutes(startDate.getMinutes());
      setStartDate(selectedDateTime);
      
      // 선택된 시작일이 종료일보다 늦으면 종료일도 같이 변경
      if (selectedDateTime > endDate) {
        setEndDate(selectedDateTime);
      }
      updateMarkedDates(selectedDateTime, selectedDateTime > endDate ? selectedDateTime : endDate);
    } else if (dateType === 'end') {
      selectedDateTime.setHours(endDate.getHours());
      selectedDateTime.setMinutes(endDate.getMinutes());
      
      // 선택된 종료일이 시작일보다 이르면 무시
      if (selectedDateTime >= startDate) {
        setEndDate(selectedDateTime);
        updateMarkedDates(startDate, selectedDateTime);
      }
    }
    setShowCalendar(false);
  };

  const handleStartDatePress = () => {
    setDateType('start');
    setShowCalendar(true);
    updateMarkedDates(startDate, endDate);
  };

  const handleEndDatePress = () => {
    setDateType('end');
    setShowCalendar(true);
    updateMarkedDates(startDate, endDate);
  };

  const handleAllDayToggle = (value) => {
    setIsAllDay(value);
    if (value) {
      const start = new Date(selectedDate);
      start.setHours(0, 0, 0, 0);
      const end = new Date(selectedDate);
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
          date={startDate}
          onDateChange={setStartDate}
          onPressDate={handleStartDatePress}
          onTimePress={() => setShowCalendar(false)}
        />
        <Icon name="arrow-forward" size={20} color="#666" style={styles.arrow} />
        <DayInput
          label="종료"
          date={endDate}
          onDateChange={setEndDate}
          minimumDate={startDate}
          onPressDate={handleEndDatePress}
          onTimePress={() => setShowCalendar(false)}
        />
      </View>

      {showCalendar && (
        <View style={styles.calendarContainer}>
          <Calendar
            current={dateType === 'start' ? startDate.toISOString() : endDate.toISOString()}
            minDate={dateType === 'end' ? startDate.toISOString().split('T')[0] : undefined}
            onDayPress={handleDateSelect}
            markedDates={markedDates}
            style={styles.calendar}
          />
        </View>
      )}

      <View style={styles.buttonContainer}>
        <Button
          text="Cancel"
          onPress={onClose}
          style={[styles.button, styles.cancelButton]}
          textStyle={{color: '#FF9500'}}
          size="large"
        />
        <Button
          text="Add"
          onPress={handleAdd}
          style={[styles.button, styles.addButton]}
          textStyle={{color: '#69BAFF'}}
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
    marginTop: 20,
  },
  titleInput: {
    fontSize: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    paddingVertical: 8,
    marginBottom: 16,
  },
  allDayContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 100,
    left: 16,
    right: 16,
    gap: 50,
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
}); 