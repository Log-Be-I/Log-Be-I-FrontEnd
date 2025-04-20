import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  TextInput, 
  StyleSheet, 
  Keyboard, 
  TouchableWithoutFeedback, 
  ScrollView, 
  KeyboardAvoidingView 
} from 'react-native';
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
  const isAddDisabled = !title.trim() || startDate > endDate;

  const titleInputRef = useRef(null);

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
// 페이지가 열릴 때 input에 강제로 포커스, 키보드 띄위기
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
      scrollViewRef.current?.scrollTo({ y: 85, animated: true });
    }
  }, [calendarOpenCount]);

  const handleAdd = async () => {
    // 검증
    if (!title.trim()) {
      setToastMessage('일정을 입력해주세요.');
      setShowToast(true);
      return;
    }

    if (startDate > endDate) {
      setToastMessage('종료일은 시작일 이후여야 합니다.');
      setShowToast(true);
      return;
    }

    try {
      await createSchedule({ 
        title, 
        startTime: startDate, 
        endTime: endDate
      });

      setTimeout(() => {
          router.replace('/calendar/');
    }, 1000);

    } catch (error) {
      console.error('일정 추가 실패:', error); 
      setToastMessage('일정 등록에 실패했습니다.');
      setShowToast(true);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <KeyboardAvoidingView behavior="height" style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.inner}>
        <View style={styles.buttonContainer}>
          <CalendarButton
            text="Cancel"
            onPress={handleCancel}
            textStyle={{color: '#FF9500'}}
          />
          <CalendarButton
            text="Add"
            onPress={handleAdd}
            textStyle={{color: isAddDisabled ? '#ccc' : '#69BAFF'}}
            disabled={isAddDisabled}
          />
      </View>
          <TextInput
            ref={titleInputRef}
            style={styles.titleInput}
            placeholder="예: 팀 회의, 공부 계획, 병원 예약"
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
        </View>
      </TouchableWithoutFeedback>

      <Toast
      visible={showToast}
      message={toastMessage}
      onHide={() => setShowToast(false)}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  inner: {
    flex: 1,
  },
  titleInput: {
    backgroundColor: 'white',
    fontWeight: 'bold',
    color: '#032B77',
    fontSize: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    paddingVertical: 8,
    marginHorizontal: 24,
    top: 10,
  },
  scrollWrapper: {
    flex: 1,
    marginTop: 10,
    backgroundColor: 'white',
  },
  scrollContent: {
    paddingBottom: 100,
    paddingTop: 0,
    flexGrow: 1, // 내용이 적어도 ScrollView가 가능하도록
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
    marginTop: 10,
    backgroundColor: 'white',
    width: '100%',
    gap: 24,
    paddingVertical: 5,
    paddingHorizontal: 16,
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