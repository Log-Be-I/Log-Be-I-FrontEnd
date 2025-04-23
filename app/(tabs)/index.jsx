import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { useRouter } from "expo-router";
import Text from "../../components/common/Text";
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

  console.log(member);

  const handleDeleteAccount = async () => {
    try {
      router.push("/settings/deleteAccount");
    } catch (error) {
      console.error("계정 삭제 에러:", error);
    }
  };

  return (
    <View style={styles.container}>
      {/* <Pressable onPress={handleLogout} style={styles.logoutButton}>
        <Text variant="medium" size={16} color="#666">
          로그아웃
        </Text>
      </Pressable> */}
      <Pressable onPress={handleDeleteAccount}>
        <Text variant="medium" size={16} color="#666">
          탈퇴하기
        </Text>
      </Pressable>
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
  logoutButton: {
    padding: 16,
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
  },
});
