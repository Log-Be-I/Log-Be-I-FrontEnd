import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Pressable, FlatList, Image } from 'react-native';
import { format } from 'date-fns';
import  Text from '../common/Text';

// 일정 항목 하나를 렌더링 하는 컴포넌트트
const ScheduleItem = ({ title, startTime, endTime}) => (
  <View style={styles.scheduleItem}>
    <View style={styles.leftContent}>
      <Image
        source={require("../../assets/schedule/check.png")}
        style={styles.checkIcon}
      />
      <View style={styles.textContent}>
        <Text variant="bold" size={16} color="#0A4DAA">
          {title}
        </Text>
      </View>
    </View>
    {/* 시간 표시 */}
    <View style={styles.timeWrapper}>
      <Text variant="regular" size={14} color="#1170DF">
        {startTime}
      </Text>
      <Text variant="regular" size={14} color="#666">
        {" "}
        To{" "}
      </Text>
      <Text variant="regular" size={14} color="#1170DF">
        {endTime}
      </Text>
    </View>
  </View>
);

// 전체 일정을 렌더링 하는 컴포넌트
export default function ScheduleComponent({ schedules = [], onPress }) {
  const [selectedDate, setSelectedDate] = useState('');

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setSelectedDate(today);
    console.log(schedules);
  }, [schedules]);

// 날짜 포맷 함수
  const formatDateTime = (dateTimeStr) => {
    const date = new Date(dateTimeStr);
    return format(date, 'M월 d일 HH:mm'/*, { locale: ko }*/);
  };

  // 각 항목을 렌더링 하는 함수 (Pressable로 감싸 클릭 처리)
  const renderItem = ({ item }) => (
    <Pressable style={styles.container} onPress={() => onPress?.(item)}>
      <ScheduleItem 
        title={item.title}
        startTime={formatDateTime(item.startTime)}
        endTime={formatDateTime(item.endTime)}
      />
    </Pressable>
  );

// 일정이 없을 경우 표시
  if (!schedules || schedules.length === 0) {
    return (
        <Text style={{textAlign: 'center', marginTop: 30}}>
          일정이 없습니다.
        </Text>
    );
  }

// 일정 리스트를 FlatList로 표시
  return (
    <FlatList
    data={schedules}
    renderItem={renderItem}
    keyExtractor={(item) => item.id.toString()}
    showsVerticalScrollIndicator={false}
    contentContainerStyle={styles.listContent}
  />
  );
}

const styles = StyleSheet.create({
  // 카드 전체 스타일일
  container: {
    backgroundColor: 'white',
    padding: 15,
    marginVertical: 5,
    marginHorizontal: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  // 한 개의 일정 항목 레이아웃
  scheduleItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#F5F9FF",
    borderRadius: 12,
  },
  leftContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  checkIcon: {
    width: 20,
    height: 20,
    resizeMode: "contain",
    opacity: 0.8,
  },
  textContent: {
    gap: 4,
  },
  subTitle: {
    opacity: 0.8,
  },
  timeWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 14,
    color: '#666',
  },

}); 