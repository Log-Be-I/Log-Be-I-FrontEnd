import React from "react";
import { View, StyleSheet } from "react-native";
import MyCalendar from "../../../components/calendar/MyCalendar";
import AddSchedule from "../../../components/calendar/AddSchedule";

export default function CalendarScreen() {
  return (
    <View style={styles.container}>
      <AddSchedule />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
});
