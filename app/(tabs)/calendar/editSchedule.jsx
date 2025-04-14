import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Modal, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import DateRangeSelector from '../../../components/calendar/DateRangeSelector';
import Button from '../../../components/common/button';
import { updateSchedule, deleteSchedule } from '../../../api/schedule/scheduleApi';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function EditSchedule() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const schedule = JSON.parse(params.schedule);
  const [title, setTitle] = useState(schedule.title);
  const [startTime, setStartTime] = useState(new Date(schedule.startTime));
  const [endTime, setEndTime] = useState(new Date(schedule.endTime));
  const [isEditing, setIsEditing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

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

  const handleDelete = async () => {
    try {
      await deleteSchedule(schedule.id);
      setModalVisible(false);
      Alert.alert('성공', '일정이 삭제되었습니다.');
      router.back();
    } catch (error) {
      Alert.alert('오류', '일정 삭제 중 오류가 발생했습니다.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Icon name="delete" size={24} color="#FF9500" />
        </TouchableOpacity>
      </View>

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
        onChange={() => setIsEditing(true)}
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
              style={styles.button}
              textStyle={{color: '#69BAFF'}}
              size="large"
            />
          </>
        )}
      </View>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>일정을 삭제하시겠습니까?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.deleteButton]}
                onPress={handleDelete}
              >
                <Text style={styles.buttonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: 16,
    //borderBottomWidth: 1,
    //borderBottomColor: '#E5E5E5',
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  modalButton: {
    padding: 10,
    borderRadius: 5,
    width: '40%',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#69BAFF',
  },
  deleteButton: {
    backgroundColor: '#FF9500',
  },
  buttonText: {
    fontSize: 16,
    color: 'white',
  },
});
