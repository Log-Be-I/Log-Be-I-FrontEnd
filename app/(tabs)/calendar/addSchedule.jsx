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
      scrollViewRef.current?.scrollTo({ y: 90, animated: true });
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
    <View style={styles.container}>
      <KeyboardAvoidingView behavior="height" style={styles.flex}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <ScrollView 
            ref={scrollViewRef}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.inputBoxWrapper}>
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
                <View style={styles.dateRangeBox}>
                  <DateRangeSelector
                    startDate={startDate}
                    endDate={endDate}
                    onDateRangeChange={handleDateRangeChange}
                    disabled={isAllDay}
                    onCalendarOpen={handleCalendarOpen}
                  />
                </View>
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
                  textStyle={{color: isAddDisabled ? '#ccc' : '#69BAFF'}}
                  disabled={isAddDisabled}
                />
            </View>
          </ScrollView>
      </TouchableWithoutFeedback>



        <Toast
        visible={showToast}
        message={toastMessage}
        onHide={() => setShowToast(false)}
        />
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  flex: {
    flex: 1,
  },
  inputBoxWrapper: {
    width: '90%',
    marginTop: 56,
    marginHorizontal: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: '#CDE6FF',  // 하늘색 윤곽선
    borderRadius: 16,
    backgroundColor: '#FFFFFF'/*'#F9FCFF'*/,  // 연한 파란 배경 (선택사항)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  titleInput: {
    backgroundColor: 'white',
    fontWeight: 'bold',
    color: '#032B77',
    fontSize: 18,
    borderColor: '#CDE6FF',
    borderRadius: 8,
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  dateRangeBox: {
    borderWidth: 1,
    borderColor: '#CDE6FF',
    borderRadius: 8,
    marginTop: 16,
    minHeight: 250,
    backgroundColor: 'white',
  },
  scrollContent: {
    paddingBottom: 100,
    paddingTop: 0,
    flexGrow: 1, // 내용이 적어도 ScrollView가 가능하도록
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 40,
    backgroundColor: 'white',
    width: '100%',
    gap: 50,
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