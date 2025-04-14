import React from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import ScheduleComponent from './ScheduleComponent';

export default function EventList({ schedules = [], onPress }) {
  const renderItem = ({ item }) => (
    <ScheduleComponent
      title={item.title}
      startTime={item.startTime}
      endTime={item.endTime}
      schedule={item}
      onPress={() => onPress(item)}
    />
  );

  return (
    <View style={styles.container}>
      <FlatList
        style={styles.list}
        data={schedules}
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
}); 