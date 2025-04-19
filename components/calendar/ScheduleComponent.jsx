import React, { useMemo } from 'react';
import { View, StyleSheet, Pressable, FlatList, Image } from 'react-native';
import { format } from 'date-fns';
import  Text from '../common/Text';
import { Holidays } from '../../dummyData/Holidays';

// 일정 항목 하나를 렌더링 하는 컴포넌트트
const ScheduleItem = ({ title, startDateTime, endDateTime, isHoliday}) => {
  const scheduledStartDay = format(new Date(startDateTime), 'MM월dd일');
  const scheduledStartTime = `${format(new Date(startDateTime), 'HH:mm')}`;

  const scheduledEndDay = format(new Date(endDateTime), 'MM월dd일');
  const scheduledEndTime = `${format(new Date(endDateTime), 'HH:mm')}`;

  return (
    <View style={[styles.scheduleItem, isHoliday && styles.holidayItem]}>
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
      <View style={styles.timeToWrapper}>
        <View style={styles.startDayWrapper}>
          <Text variant="regular" size={14} color="#1170DF">
          {scheduledStartDay}
          </Text>
          <Text variant="regular" size={14} color="#1170DF">
            {scheduledStartTime}
          </Text>
        </View>
        <View style={styles.timeToTextWrapper}>
          <Text variant="regular" size={14} color="#666">
            {" "}
            To{" "}
          </Text>
        </View>
        <View style={styles.endDayWrapper}>
          <Text variant="regular" size={14} color="#1170DF">
            {scheduledEndDay}
          </Text>
          <Text variant="regular" size={14} color="#1170DF">
            {scheduledEndTime}
          </Text>
        </View>
      </View>
    </View>
  );
};

// 전체 일정을 렌더링 하는 컴포넌트
export default function ScheduleComponent({ schedules = [], onPress, selectedDate }) {
  const combinedSchedules = useMemo(() => {
    const holiday = Holidays[selectedDate];
    if(!holiday) return schedules;
    return [...schedules, {
      name: holiday.name,
      startDateTime: `${selectedDate}T12:00:00`,
      endDateTime: `${selectedDate}T23:50:00`,
      isHoliday: true,
      }
    ];
  }, [schedules, selectedDate]);

// // 날짜 포맷 함수
//   const formatDateTime = (dateTimeStr) => {
//     const date = new Date(dateTimeStr);
//     return format(date, 'M월 d일 HH:mm'/*, { locale: ko }*/);
//   };

  // 각 항목을 렌더링 하는 함수 (Pressable로 감싸 클릭 처리)
  const renderItem = ({ item }) => (
    <Pressable onPress={() => onPress?.(item)}>
      <ScheduleItem 
        title={item.title || item.name}
        startDateTime={item.startDateTime || `${item.date}T12:00:00`}
        endDateTime={item.endDateTime || `${item.date}T23:50:00`}
        isHoliday={item.isHoliday}
      />
    </Pressable>
  );


// 일정 리스트를 FlatList로 표시
  return (
    <View style={styles.container}>
      <View style={styles.sectionTitleContainer}>
        <View style={styles.titleWrapper}>
          <Text 
          variant="semibold" 
          size={20} 
          color="#1170DF"
          style={styles.sectionTitle}>
            일정
          </Text>
          <View style={styles.underline} />
        </View>
      </View>

    {combinedSchedules.length === 0 ? (
      <Text style={{textAlign: 'center', marginTop: 30}}>
        일정이 없습니다.
      </Text>
    ) : (
      <FlatList
      data={combinedSchedules}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.listContent}
      />
    )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  sectionTitleContainer: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  titleWrapper: {
    flexDirection: "column",
    alignItems: "flex-start",
  },
  sectionTitle: {
    marginBottom: 8,
  },
  underline: {
    width: 40,
    height: 2,
    backgroundColor: "#1170DF",
    borderRadius: 1,
  },
  rightButton: {
    height: 44,
    paddingHorizontal: 20,
    borderRadius: 50,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(105, 186, 255, 0.1)",
    shadowColor: "#69BAFF",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  listContent: {
    gap: 12,
  },
  scheduleItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#F5F9FF",
    borderRadius: 12,
  },
  holidayItem: {
    backgroundColor: "#FFF0F0",
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
  timeToWrapper: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-end",
    marginTop: 4,
  },
  startDayWrapper: {
    flexDirection: "cloumn",
    alignItems: "center",
    gap: 8,
  },
  timeToTextWrapper: {
    marginHorizontal: 8,
  },
  endDayWrapper: {
    flexDirection: "cloumn",
    alignItems: "center",
    gap: 8,
  },
});