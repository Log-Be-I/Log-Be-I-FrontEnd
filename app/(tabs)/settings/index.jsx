import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import NotificationToggle from "../../../components/settings/NotificationToggle";
import { useRouter } from "expo-router";

export default function SettingsPage() {
  const [notifications, setNotifications] = useState({
    schedule: true,
    progress: true,
    email: false,
    push: true,
    nightPush: false,
    marketing: false,
    emailMarketing: true,
    snsMarketing: true,
  });
  const router = useRouter();

  const handleToggle = (key) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>알림</Text>
      <View style={styles.divider} />

      <View style={styles.togglesContainer}>
        <NotificationToggle
          title="소리 알림"
          isEnabled={notifications.schedule}
          onToggle={() => handleToggle("schedule")}
        />
        <NotificationToggle
          title="진동 알림"
          isEnabled={notifications.progress}
          onToggle={() => handleToggle("progress")}
        />
        <NotificationToggle
          title="이메일 알림"
          isEnabled={notifications.email}
          onToggle={() => handleToggle("email")}
        />
        <NotificationToggle
          title="PUSH 알림"
          isEnabled={notifications.push}
          onToggle={() => handleToggle("push")}
        />
        <NotificationToggle
          title="야간 PUSH 알림"
          isEnabled={notifications.nightPush}
          onToggle={() => handleToggle("nightPush")}
        />
        <NotificationToggle
          title="마케팅 수신 동의"
          isEnabled={notifications.marketing}
          onToggle={() => handleToggle("marketing")}
        />
        <NotificationToggle
          title="이메일 수신 동의"
          isEnabled={notifications.emailMarketing}
          onToggle={() => handleToggle("emailMarketing")}
        />
        <NotificationToggle
          title="SNS 수신 동의"
          isEnabled={notifications.snsMarketing}
          onToggle={() => handleToggle("snsMarketing")}
        />
      </View>
      <View style={styles.buttonContainer}>
        <Pressable
          onPress={() => router.push("/settings/deleteAccount")}
          style={styles.button}
        >
          <Text style={styles.buttonText}>회원탈퇴</Text>
          <View style={styles.buttonBorder} />
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 18,
    color: "#5F5F5F",
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  divider: {
    height: 1,
    backgroundColor: "#D9D9D9",
    marginBottom: 10,
  },
  togglesContainer: {
    paddingHorizontal: 20,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginTop: 10,
  },
  button: {
    position: "absolute",
    right: 20,
    paddingVertical: 8,
    zIndex: 10,
  },
  buttonText: {
    fontSize: 12,
    color: "#5F5F5F",
  },
  buttonBorder: {
    height: 1,
    width: "100%",
    backgroundColor: "#5F5F5F",
  },
});
