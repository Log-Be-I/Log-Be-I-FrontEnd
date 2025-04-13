import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

export default function DayInput({ 
  label, 
  date, 
  onDateChange, 
  minimumDate,
  onPressDate,
  onTimePress
}) {
  const [showTimePicker, setShowTimePicker] = useState(false);

  const handleTimeChange = (event, selectedDate) => {
    if (selectedDate) {
      onDateChange(selectedDate);
    }
    setShowTimePicker(false);
    if (onTimePress) {
      onTimePress();
    };
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputContainer}>
        <TouchableOpacity 
            style={styles.dateButton}
            onPress={onPressDate}
        >
            <Text style={styles.dateText}>
            {format(date, 'M월 d일 (E)', { locale: ko })}
            </Text>
        </TouchableOpacity>
        <TouchableOpacity 
            style={styles.timeButton}
            onPress={() => setShowTimePicker(true)}
        >
            <Text style={styles.timeText}>
            {format(date, 'a h:mm', { locale: ko })}
            </Text>
        </TouchableOpacity>
      </View>


      {showTimePicker && (
        <DateTimePicker
          value={date}
          mode="time"
          is24Hour={false}
          display="spinner"
          onChange={handleTimeChange}
          minuteInterval={10}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    flex : 1,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  dateButton: {
    paddingVertical: 8,
    marginBottom: 12,
  },
  timeButton: {
    paddingVertical: 8,
  },
  dateText: {
    fontSize: 16,
    color: '#333',
  },
  timeText: {
    fontSize: 16,
    color: '#333',
  },
}); 