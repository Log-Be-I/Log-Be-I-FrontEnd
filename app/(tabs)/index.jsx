import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import Weather from "../../components/home/weather";
import MainScheduleList from "../../components/home/MainScheduleList";
import { useMemberStore } from "../../zustand/stores/member";

export default function HomeScreen() {
  const router = useRouter();

  const { member } = useMemberStore();

  console.log(member);

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
