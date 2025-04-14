import React, { useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import DateRangeSelector from '../../../components/calendar/DateRangeSelector';
import Button from '../../../components/common/button';
import { createSchedule } from '../../../api/schedule/scheduleApi';

export default function AddSchedule({ onClose, onAdd }) {
  const router = useRouter();
  const { selectedDate } = useLocalSearchParams();
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState(new Date(selectedDate));
  const [endDate, setEndDate] = useState(new Date(selectedDate));
  const [isAllDay, setIsAllDay] = useState(false);

  const handleDateRangeChange = (start, end) => {
    setStartDate(start);
    setEndDate(end);
  };

  const handleAdd = async () => {
    try {
      await createSchedule({ 
        title, 
        startTime: startDate, 
        endTime: endDate
      });
      router.back(); // 일정 추가 후 이전 화면으로 돌아가기
    } catch (error) {
      console.error('일정 추가 실패:', error);
    }
  };

  const handleCancel = () => {
    router.back();
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

      <DateRangeSelector
        startDate={startDate}
        endDate={endDate}
        onDateRangeChange={handleDateRangeChange}
        disabled={isAllDay}
      />

      <View style={styles.buttonContainer}>
        <Button
          text="Cancel"
          onPress={handleCancel}
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
  },
  titleInput: {
    fontSize: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    paddingVertical: 8,
    marginBottom: 25,
    top: 15,
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