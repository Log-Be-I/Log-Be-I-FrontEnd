import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';
import CalendarDay from './CalendarDay';

export default function CalendarBody({ selected, onDayPress, markedDates }) {
    
  return (
    <View style={styles.container}>
      <Calendar
        style={styles.calendar}
        onDayPress={onDayPress}
        markedDates={markedDates}
        monthFormat='yyyy년 MM월'
        //hideArrows={true}
        hideExtraDays={false}
        dayComponent={({ date, state }) => (
          <CalendarDay
            date={date}
            selected={selected}
            onPress={onDayPress}
            hasEvent={markedDates[date.dateString]?.marked}
          />
        )}
        theme={{
          selectedDayBackgroundColor: '#4A90E2',
          selectedDayTextColor: 'white',
          todayTextColor: '#69BAFF',
          textDayFontFamily: 'Pretendard-Regular',
          textDayHeaderFontFamily: 'Pretendard-Regular',
          textDisabledColor: '#ccc',
          dotColor: '#69BAFF',
          dayTextColor: '#222',
          selectedDotColor: 'white',
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
