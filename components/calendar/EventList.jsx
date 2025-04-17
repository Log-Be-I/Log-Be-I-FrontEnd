import React from 'react';
import { View, FlatList, StyleSheet, Text } from 'react-native';
import ScheduleComponent from './ScheduleComponent';
import { Holidays } from '../../dummyData/Holidays';

export default function EventList({ schedules = [], selectedDate, onPress }) {
  const today = new Date().toISOString().split('T')[0];
  const holidayInfo = Holidays[selectedDate ?? today];
  
  const renderItem = ({ item }) => {
    if (item.type === 'holiday') {
      return (
        <View style={styles.holidayContainer}>
          <Text style={styles.holidayText}>{item.name}</Text>
        </View>
      );
    }
    
    return (
      <ScheduleComponent
        title={item.title}
        startTime={item.startTime}
        endTime={item.endTime}
        schedule={item}
        onPress={() => onPress(item)}
      />
    );
  };

  const allEvents = [
    ...(holidayInfo ? [{ id: 'holiday-' + selectedDate, type: 'holiday', name: holidayInfo.name }] : []),
    ...schedules
  ];

  return (
    <View style={styles.container}>
      <FlatList
        style={styles.list}
        data={allEvents}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    marginTop: 10,
    maxHeight: '42%',
  },
  list: {
    flex: 1,
  },
  holidayContainer: {
    padding: 15,
    backgroundColor: '#FFF5F5',
    marginHorizontal: 10,
    marginVertical: 5,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#FF4B4B',
  },
  holidayText: {
    color: '#FF4B4B',
    fontSize: 14,
    fontFamily: 'Pretendard-Medium',
  },
}); 