import React, { useState, useEffect } from "react";
import { View, StyleSheet, FlatList, Image, Pressable } from "react-native";
import { useRouter } from "expo-router";
import Text from "../common/Text";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { getTodaySchedules } from "../../api/schedule";
import dayjs from "dayjs";

const renderItem = ({ item }) => {
  const startTime = dayjs(item.startDateTime).format("HH:mm");
  const endTime = dayjs(item.endDateTime).format("HH:mm");

  const parsedItem = {
    ...item,
    title: item.title,
    startTime: startTime,
    endTime: endTime,
    isAllDay: startTime === "00:00" && endTime === "23:50",
  };
  console.log("parsedItem: ", parsedItem);

  return <ScheduleItem item={parsedItem} />;
};

const ScheduleItem = ({ item }) => (
  <View style={styles.scheduleItem}>
    <View style={styles.leftContent}>
      <Image
        source={require("../../assets/schedule/check.png")}
        style={styles.checkIcon}
      />
      <View style={styles.textContent}>
        <Text variant="bold" size={16} color="#0A4DAA">
          {item.title}
        </Text>
      </View>
    </View>
    <View style={styles.timeWrapper}>
      {item.isAllDay ? (
        <Text variant="regular" size={14} color="#1170DF">
          하루종일
        </Text>
      ) : (
        <>
          <Text variant="regular" size={14} color="#1170DF">
            {item.startTime}
          </Text>
          <Text variant="regular" size={14} color="#666">
            {" "}
            To{" "}
          </Text>
          <Text variant="regular" size={14} color="#1170DF">
            {item.endTime}
          </Text>
        </>
      )}
    </View>
  </View>
);

export default function MainScheduleList() {
  const router = useRouter();
  const [todaySchedules, setTodaySchedules] = useState([]);
  console.log("TodaySchedules: ", todaySchedules);

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const data = await getTodaySchedules();
        setTodaySchedules(data);
        console.log(data);
      } catch (error) {
        console.error("오늘의 일정을 불러오는데 실패했습니다.", error);
      }
    };

    fetchSchedules();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.sectionTitleContainer}>
        <View style={styles.titleWrapper}>
          <View>
            <Text
              variant="semibold"
              size={20}
              color="#1170DF"
              style={styles.sectionTitle}
            >
              Schedule
            </Text>
            <View style={styles.underline} />
          </View>
        </View>
        {/* <Pressable
          style={styles.rightButton}
          onPress={() => {
            // TODO: 기능 구현
          }}
        >
          <View style={styles.briefingButton}>
            <Icon name="waveform" size={20} color="#69BAFF" />
            <Text
              variant="medium"
              size={16}
              color="#69BAFF"
              style={styles.briefingText}
            >
              Briefing
            </Text>
            <Icon
              name="waveform"
              size={20}
              color="#69BAFF"
              style={styles.rightWaveform}
            />
          </View>
        </Pressable> */}
      </View>
      <FlatList
        data={todaySchedules}
        renderItem={renderItem}
        keyExtractor={(item) => item.scheduleId}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListFooterComponent={() => <View style={{ height: 80 }} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  sectionTitleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  titleWrapper: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  sectionTitle: {
    marginBottom: 8,
  },
  underline: {
    width: 24,
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
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  briefingButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  rightWaveform: {
    transform: [{ scaleX: -1 }],
  },
  briefingText: {
    marginHorizontal: 6,
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
});
