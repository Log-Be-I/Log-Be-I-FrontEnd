import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import DateRangeSelector from '../../../components/calendar/DateRangeSelector';
import Button from '../../../components/common/button';
import { updateSchedule } from '../../../api/schedule/scheduleApi';

export default function EditSchedule({ onClose, onEdit }) {
  const router = useRouter();
  const { schedule: scheduleParam } = useLocalSearchParams();
  const schedule = JSON.parse(scheduleParam); // 문자열로 받은 schedule 객체를 다시 파싱
  console.log('schedule', schedule);

  const [title, setTitle] = useState(schedule.title);
  const [startTime, setStartTime] = useState(new Date(schedule.startTime));
  const [endTime, setEndTime] = useState(new Date(schedule.endTime));
  const [isEditing, setIsEditing] = useState(false);

  const handleDateRangeChange = (start, end) => {
    setStartTime(start);
    setEndTime(end);
  };

  const handleEdit = async () => {
    try {
      await updateSchedule(schedule.id, {
        title,
        startTime,
        endTime
      });
      setIsEditing(false);
      router.back(); // 수정 완료 후 이전 화면으로 돌아가기
    } catch (error) {
      console.error('일정 수정 실패:', error);
    }
  };

  const handleCancel = () => {
    router.back(); // 취소하면 이전 화면으로 돌아가기
  };

  return (
    <View style={styles.container}>
      {isEditing ? (
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="일정"
        />
      ) : (
        <Text style={styles.title} onPress={() => setIsEditing(true)}>
          {title}
        </Text>
      )}

      <DateRangeSelector
        startDate={startTime}
        endDate={endTime}
        onDateRangeChange={handleDateRangeChange}
        disabled={!isEditing} //false 여야 시간도 선택 가능
      />

      <View style={styles.buttonContainer}>
        {isEditing ? (
          <>
            <Button
              text="Edit"
              onPress={handleEdit}
              style={[styles.button, styles.cancelButton]}
              textStyle={{color: '#69BAFF'}}
              size="large"
            />
            <Button
              text="Cancel"
              onPress={handleCancel}
              style={[styles.button, styles.cancelButton]}
              textStyle={{color: '#FF9500'}}
              size="large"
            />
          </>
        ) : (
          <>
            <Button
              text="OK"
              onPress={handleCancel}
              style={[styles.button, styles.addButton]}
              textStyle={{color: '#69BAFF'}}
              size="large"
            />
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
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
    minWidth: 100,
  },
});
