import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { useRouter } from "expo-router";
import useAuthStore from "../../zustand/stores/authStore";
import Text from "../../components/common/Text";
import Weather from "../../components/home/weather";
import MainScheduleList from "../../components/home/MainScheduleList";

export default function HomeScreen() {
  const router = useRouter();
  const { logout } = useAuthStore();

  const handleLogout = async () => {
    try {
      await logout();
      router.replace("/(onBoard)");
    } catch (error) {
      console.error("로그아웃 에러:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Pressable onPress={handleLogout} style={styles.logoutButton}>
        <Text variant="medium" size={16} color="#666">
          로그아웃
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
