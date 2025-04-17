import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';
import CalendarDay from './CalendarDay';
import { Holidays } from '../../dummyData/Holidays';

export default function CalendarBody({ selected, onDayPress, markedDates }) {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const handleDayPress = (day) => {
    const holidayInfo = Holidays[day.dateString];
    setSelectedDate(day.dateString); // 선택 날자 갱신
    onDayPress?.({...day, 
      isHoliday: !!holidayInfo, 
      holidayName: holidayInfo?.name
    });
  };

  const [currentDate] = useState(new Date().toISOString().split('T')[0]);
  
  // 공휴일과 일정을 합친 markedDates 생성
  const combinedMarkedDates = {
    ...Object.keys(Holidays).reduce((acc, date) => ({
      ...acc,
      [date]: {
        marked: true,
        type: 'holiday',
        name: Holidays[date].name
      }
    }), {}),
    ...markedDates
  };

  return (
    <View style={styles.container}>
      <Calendar
        style={styles.calendar}
        onDayPress={(day) => {
          // 공휴일 정보가 있으면 함께 전달
          const holidayInfo = Holidays[day.dateString];
          onDayPress({
            ...day,
            isHoliday: !!holidayInfo,
            holidayName: holidayInfo?.name
          });
        }}
        current={currentDate}
        markedDates={combinedMarkedDates}
        monthFormat='yyyy년 MM월'
        hideExtraDays={false}
        enableSwipeMonths={true}
        dayComponent={({ date, state }) => (
          <CalendarDay
            date={date}
            selected={selected}
            onPress={handleDayPress}
            hasEvent={markedDates[date.dateString]?.marked}
            isHoliday={Holidays[date.dateString]?.type === 'holiday'}
            holidayName={Holidays[date.dateString]?.name}
          />
        )}
        theme={{
          selectedDayBackgroundColor: '#69BAFF',
          selectedDayTextColor: 'white',
          textDayFontFamily: 'Pretendard-Regular',
          textDayHeaderFontFamily: 'Pretendard-Regular',
          textDisabledColor: '#ccc',
          dotColor: '#69BAFF',
          dayTextColor: '#222',
          selectedDotColor: 'white',
          arrowColor: '#69BAFF',
          monthTextColor: '#333',
          textMonthFontFamily: 'Pretendard-Medium',
          textDayHeaderFontSize: 14,
          'stylesheet.calendar.main': {
            week: {
              marginTop: 2,
              flexDirection: 'row',
              justifyContent: 'space-around',
            },
          },
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
  },
  calendar: {
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    height: 350,
  },
}); 
// 해당 날짜에 일정이 있는지 여부를 Boolean으로 전달하는 prop이다.
// hasEvent 값이 true이면 dot을 표시하고, false이면 dot을 표시하지 않는다.
