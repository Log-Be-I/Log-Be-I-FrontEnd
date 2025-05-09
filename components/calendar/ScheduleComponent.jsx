import React, { useMemo } from "react";
import { View, StyleSheet, Pressable, FlatList, Image } from "react-native";
import { format } from "date-fns";
import Text from "../common/Text";
import { Holidays } from "../../dummyData/Holidays";



const formatKoreanDate = (dateTimeString) => {
  const [datePart] = dateTimeString.split("T");
  const [year, month, day] = datePart.split("-");
  return `${parseInt(month)}월 ${parseInt(day)}일`;
};

const ScheduleItem = ({ title, startDateTime, endDateTime, isHoliday }) => {
  return (
    <View style={[styles.scheduleItem, isHoliday && styles.holidayItem]}>
      <View style={styles.rowContent}>
        <View style={styles.leftSection}>
          <Image
            source={require("../../assets/schedule/check.png")}
            style={styles.checkIcon}
          />
          <Text
            variant="bold"
            size={16}
            color={isHoliday ? "#F28B82" : "#0A4DAA"}
            numberOfLines={2}
            style={styles.titleText}
          >
            {title}
          </Text>
        </View>

        <View style={styles.dateTimeRow}>
          {/* 시작 날짜 + 시간 */}
          <View style={styles.dateTimeBlock}>
            <Text
              style={[
                styles.dateText,
                { color: isHoliday ? "#F28B82" : "#1170DF" },
              ]}
            >
              {/* {startDateTime.split("T")[0]} */}
              {formatKoreanDate(startDateTime)}
            </Text>
            <Text
              style={[
                styles.timeText,
                { color: isHoliday ? "#F28B82" : "#1170DF" },
              ]}
            >
              {/* {scheduledStartTime} */}
              {startDateTime.split("T")[1].slice(0, 5)}
            </Text>
          </View>

          <Text style={styles.toText}>To</Text>

          {/* 종료 날짜 + 시간 */}
          <View style={styles.dateTimeBlock}>
            <Text
              style={[
                styles.dateText,
                { color: isHoliday ? "#F28B82" : "#1170DF" },
              ]}
            >
              {formatKoreanDate(endDateTime)}
            </Text>
            <Text
              style={[
                styles.timeText,
                { color: isHoliday ? "#F28B82" : "#1170DF" },
              ]}
            >
              {/* {scheduledEndTime} */}
              {endDateTime.split("T")[1].slice(0, 5)}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default function ScheduleComponent({ schedules = [], onPress }) {
  const combinedSchedules = useMemo(() => schedules, [schedules]);

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

  return (
    <View style={styles.container}>
      <View style={styles.sectionTitleContainer}>
        <View style={styles.titleWrapper}>
          <Text
            variant="semibold"
            size={20}
            color="#1170DF"
            style={styles.sectionTitle}
          >
            일정
          </Text>
          <View style={styles.underline} />
        </View>
      </View>

      {combinedSchedules.length === 0 ? (
        <Text style={{ textAlign: "center", marginTop: 30 }}>
          일정이 없습니다.
        </Text>
      ) : (
        <FlatList
          data={combinedSchedules}
          renderItem={renderItem}
          keyExtractor={(item, index) =>
            item.scheduleId?.toString() || `${item.title}-${index}`
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.listContent, { paddingBottom: 120 }]}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  sectionTitleContainer: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  titleWrapper: { flexDirection: "column", alignItems: "flex-start" },
  sectionTitle: { marginBottom: 8 },
  underline: {
    width: 40,
    height: 2,
    backgroundColor: "#1170DF",
    borderRadius: 1,
  },
  listContent: { gap: 12 },

  scheduleItem: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    backgroundColor: "#F5F9FF",
    borderColor: "#0A4DAA",
  },
  holidayItem: {
    backgroundColor: "#FFF0F0",
    borderColor: "#F28B82",
  },
  rowContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  titleText: {
    flex: 1,
    flexWrap: "wrap",
    lineHeight: 22,
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    flex: 1,
  },
  checkIcon: {
    width: 20,
    height: 20,
    marginTop: 2,
    resizeMode: "contain",
  },
  dateTimeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 12,
  },
  dateTimeBlock: {
    flexDirection: "column",
    alignItems: "center",
  },
  dateText: {
    fontSize: 13,
  },
  timeText: {
    fontSize: 13,
    marginTop: 2,
  },
  toText: {
    fontSize: 13,
    color: "#999",
  },
});
