import React, { useState, useEffect, useRef } from 'react';
import { View, TextInput, StyleSheet, Keyboard, TouchableWithoutFeedback, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import DateRangeSelector from '../../../components/calendar/DateRangeSelector';
import CalendarButton from '../../../components/calendar/CalendarButton';
import { createSchedule } from '../../../api/schedule/scheduleApi';
import Toast from '../../../components/common/Toast';

export default function AddSchedule({ onClose, onAdd }) {
  const router = useRouter();
  const scrollViewRef = useRef(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [calendarOpenCount, setCalendarOpenCount] = useState(0);
  const { selectedDate } = useLocalSearchParams();

  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState(new Date(selectedDate));
  const [endDate, setEndDate] = useState(new Date(selectedDate));
  const [isAllDay, setIsAllDay] = useState(false);

  const titleInputRef = useRef(null);

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
// 페이지가 열릴 때 iimput에 강제로 포커스, 키보드 띄위기
  useEffect(() => {
    const timer = setTimeout(() => {
      titleInputRef.current?.focus();
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  const handleDateRangeChange = (start, end) => {
    setStartDate(start);
    setEndDate(end);
  };

  // 달력 스크롤을 시키기위한 자동으로 강제 트리거
  const handleCalendarOpen = () => {
    setShowCalendar(true);
    setCalendarOpenCount(prev => prev +1);
  }

  //showCalendar 가 true일때 scroll 이동
  useEffect(() => {
    if (scrollViewRef.current) {
      // 달력이 열릴때 자동 스크롤
      scrollViewRef.current?.scrollTo({ y: 80, animated: true });
    }
  }, [calendarOpenCount]);

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
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        <TextInput
          ref={titleInputRef}
          style={styles.titleInput}
          placeholder="일정"
          value={title}
          onChangeText={setTitle}
          multiline={true}
          maxLength={50}
          numberOfLines={3}
          textAlignVertical='top'
          returnKeyType="done"
          onSubmitEditing={() => Keyboard.dismiss()}
        />

        <View style={styles.scrollWrapper}>
          <ScrollView
            ref={scrollViewRef}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
            // keyboardShouldPersistTaps='handled'
          >
            <DateRangeSelector
              startDate={startDate}
              endDate={endDate}
              onDateRangeChange={handleDateRangeChange}
              disabled={isAllDay}
              onCalendarOpen={handleCalendarOpen}
            />
          </ScrollView>
        </View>

        <View style={styles.buttonContainer}>
          <CalendarButton
            text="Cancel"
            onPress={handleCancel}
            textStyle={{color: '#FF9500'}}
          />
          <CalendarButton
            text="Add"
            onPress={handleAdd}
            textStyle={{color: '#69BAFF'}}
          />
        </View>
        <Toast
        visible={showToast}
        message={toastMessage}
        onHide={() => setShowToast(false)}
      />
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  titleInput: {
    backgroundColor: 'white',
    fontSize: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    paddingVertical: 8,
    marginHorizontal: 16,
    top: 5,
  },
  scrollWrapper: {
    flex: 1,
    marginTop: 5,
    backgroundColor: 'white',
  },
  scrollContent: {
    paddingBottom: 120,
    flexGrow: 1, // 내용이 적어도 ScrollView가 가능하도록
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    backgroundColor: 'white',
    width: '100%',
    bottom: 120,
    gap: 70,
    paddingVertical: 5,
    zIndex: 10,
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