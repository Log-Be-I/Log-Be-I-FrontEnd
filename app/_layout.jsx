import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import * as Notifications from "expo-notifications";
//import * as Device from "expo-device";
import { View, Text, Button,Platform } from "react-native";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import "react-native-reanimated";
import { ThemeProvider as CustomThemeProvider } from "../context/ThemeContext";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import Constants from "expo-constants";

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// 인증 상태에 따라 리다이렉션 처리
export default function RootLayout() {
  const [expoPushToken, setExpoPushToken] = useState(null);

  const [loaded] = useFonts({
    Pretendard: require("../assets/fonts/Pretendard-Regular.otf"),
    "Pretendard-Bold": require("../assets/fonts/Pretendard-Bold.otf"),
    "Pretendard-Medium": require("../assets/fonts/Pretendard-Medium.otf"),
    "Pretendard-SemiBold": require("../assets/fonts/Pretendard-SemiBold.otf"),
  });
  
  useEffect(() => {
    registerForPushNotifications();
  }, []);

  // 앱 초기화 및 상태 복원
  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();

      GoogleSignin.configure({
        forceCodeForRefreshToken: true,
        webClientId: Constants.expoConfig.extra.googleWebClientId,
        offlineAccess: true,
      });
    }
  }, [loaded]);

  const registerForPushNotifications = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
      const { status: newStatus } = await Notifications.requestPermissionsAsync();
      console.log("🔔 다시 요청한 권한 상태:", newStatus);
    }
  
    const token = (await Notifications.getExpoPushTokenAsync()).data;
    setExpoPushToken(token);
    console.log("✅ Expo Push Token:", token);

    // 서버로 푸시 토큰 등록 (사용자 식별자와 함꼐 전송 가능)
    await registerPushTokenToServer(token);
  };
//  서버로 푸시 토큰 등록 함수
  const registerPushTokenToServer = async (token, memberId) => {
    try {
      const response = await fetch("http://192.168.0.10:8080/api/notifications/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
        }),
      });

      const data = await response.json();
      console.log("🔔 서버로 푸시 토큰 등록 응답:", data);
    } catch (error) {
      console.error("🔴 서버로 푸시 토큰 등록 오류:", error);
    }
  };
  // 푸시 알림 요청(서버로)
  const sendPushNotification = async () => {
    try {
      const response = await fetch ("http://localhost:8080/api/notifications/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          title: "Hello!",
          body: "This is a test notification using FCM V1.",
        }),
      });

      const data = await response.json();
      console.log("🔔 서버로 푸시 알림 요청 응답:", data);
      Alert.alert("Notification Sent", JSON.stringify(data));
    } catch (error) {
      console.error("🔴 서버로 푸시 알림 요청 오류:", error);
  }
};

  return (
    <CustomThemeProvider>
      <ThemeProvider value={DefaultTheme}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(onBoard)" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="schedule" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
          <Stack.Screen name="analysis" />
          <Stack.Screen name="issueCard" />
          <Stack.Screen name="notice" />
          <Stack.Screen name="profile" />
          <Stack.Screen name="qna" />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </CustomThemeProvider>
  );
}
