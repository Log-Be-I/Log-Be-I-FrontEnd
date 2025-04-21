import React, { useState } from 'react';
import { View, StyleSheet, Text, Switch, Keyboard, Modal, Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Calendar } from 'react-native-calendars';
import DayInput from './DayInput';

export default function DateRangeSelector({ 
  startDate, 
  endDate, 
  onDateRangeChange, 
  disabled,
  onChange, // 부모에서 내려온 setIsEditing(true)
  onCalendarOpen, // 부모로부터 받은 콜백
 }) {
  const [startedDate, setStartedDate] = useState(new Date(startDate));
  const [endedDate, setEndedDate] = useState(new Date(endDate));
  const [showCalendarModal, setShowCalendarModal] = useState(false);
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

  const handleAllDayToggle = () => {
    const newIsAllDay = !isAllDay;
    if (newIsAllDay) {
      const start = new Date(startedDate);
      start.setHours(0, 0, 0, 0);
      const end = new Date(start);
      end.setHours(23, 50, 0, 0);
      setStartedDate(start);
      setEndedDate(end);
    }
    setIsAllDay(newIsAllDay);
    if (onChange) onChange(); // 변경 발생 알림
  };

  const handleDateSelect = (day) => {
    const selectedDateTime = new Date(day.dateString);
    
    if (dateType === 'start') {
      selectedDateTime.setHours(startedDate.getHours());
      selectedDateTime.setMinutes(startedDate.getMinutes());
      setStartedDate(selectedDateTime);
      
      // 선택된 시작일이 종료일보다 늦으면 종료일도 같이 변경
      if (selectedDateTime > endedDate) {
        setEndedDate(selectedDateTime);
      }
      updateMarkedDates(selectedDateTime, selectedDateTime > endedDate ? selectedDateTime : endedDate);
    } else if (dateType === 'end') {
      selectedDateTime.setHours(endedDate.getHours());
      selectedDateTime.setMinutes(endedDate.getMinutes());
      
      // 선택된 종료일이 시작일보다 이르면 무시
      if (selectedDateTime >= startedDate) {
        setEndedDate(selectedDateTime);
        updateMarkedDates(startedDate, selectedDateTime);
      }
    }
    // 날짜가 변경되면 하루종일 토글을 false로 설정
    setIsAllDay(false);
    setShowCalendarModal(false);
    if (onChange) onChange(); // 변경 발생 알림 
  };

  const handleStartDatePress = () => {
    setDateType('start');
    setShowCalendarModal(true);
    updateMarkedDates(startedDate, endedDate);
    if (onCalendarOpen) onCalendarOpen(); // 부모로 콜백 전달
    Keyboard.dismiss();
  };

  const handleEndDatePress = () => {
    setDateType('end');
    setShowCalendarModal(true);
    updateMarkedDates(startedDate, endedDate);
    if (onCalendarOpen) onCalendarOpen(); // 부모로 콜백 전달
    Keyboard.dismiss();
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
          date={startedDate}
          onDateChange={(date) => {
            setStartedDate(date)
            if (onChange) onChange();
          }}
          onPressDate={handleStartDatePress}
          onTimePress={() => setShowCalendarModal(false)}
        />
        <Icon name="arrow-forward" size={20} color="#666" style={styles.arrow} />
        <DayInput
          label="종료"
          date={endedDate}
          onDateChange={(date) => {
            setEndedDate(date)
            if (onChange) onChange();
          }}
          minimumDate={startedDate}
          onPressDate={handleEndDatePress}
          onTimePress={() => setShowCalendarModal(false)}
        />
      </View>

      {showCalendarModal && (
        <Modal
          visible={showCalendarModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowCalendarModal(false)}
        >
          <Pressable
            style={styles.modalOverlay}
            onPress={() => setShowCalendarModal(false)}
          >
            <Pressable style={styles.calendarWrapper} onPress={() => {}}>
              <Calendar
                current={dateType === 'start' ? startedDate.toISOString() : endedDate.toISOString()}
                minDate={dateType === 'end' ? startedDate.toISOString().split('T')[0] : undefined}
                onDayPress={handleDateSelect}
                markedDates={markedDates}
                style={styles.calendar}
                theme={{
                calendarBackground: 'white',
                selectedDayBackgroundColor: '#69BAFF',
                todayTextColor: '#2563ED',
              }}
              monthFormat={'yyyy년 MM월'}
            />
          </Pressable>
        </Pressable>
      </Modal>
      )}
    </View>
  );
  }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 16,
  },
  allDayContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: 0,
  },
  allDayLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  allDayText: {
    fontSize: 14,
    color: '#888',
    marginLeft: 4,
  },
  dateContainer: {
    marginTop: 12,
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
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  calendarWrapper: {
    width: '95%',
    borderRadius: 12,
    backgroundColor: 'white',
    padding: 16,
  },
  calendar: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 12,
    backgroundColor: 'white',
    elevation: 4,
    padding: 5,
    marginTop: 4,
    width: '100%',
    height: 380,
    alignSelf: 'center',
  },
}); 