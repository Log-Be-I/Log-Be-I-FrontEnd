import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import Weather from "../../components/home/weather";
import MainScheduleList from "../../components/home/MainScheduleList";
import { useMemberStore } from "../../zustand/stores/member";

export default function HomeScreen() {
  const router = useRouter();

  const { member } = useMemberStore();


  const handleLogout = async () => {
    try {
      await logout();
      router.replace("/(onBoard)");
    } catch (error) {
      console.error("로그아웃 에러:", error);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      router.push("/settings/deleteAccount");
    } catch (error) {
      console.error("계정 삭제 에러:", error);
    }
  };

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
