import React from "react";
import { View, StyleSheet } from "react-native";
import Text from "../../components/common/Text";
import Weather from "../../components/home/weather";
import MainScheduleList from "../../components/home/MainScheduleList";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Weather />
      <MainScheduleList />
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
