import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useCallback, useState } from "react";
import "react-native-reanimated";
import { ThemeProvider as CustomThemeProvider } from "../context/ThemeContext";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import Constants from "expo-constants";
import useAuthStore from "../zustand/stores/useAuthStore";
import {
  initializeNotifications,
  setNotificationResponseHandler,
} from "../utils/notifications";
import * as Notifications from "expo-notifications";

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();
// 인증 상태에 따라 리다이렉션 처리
export default function RootLayout() {
  const router = useRouter();
  const [loaded] = useFonts({
    Pretendard: require("../assets/fonts/Pretendard-Regular.otf"),
    "Pretendard-Bold": require("../assets/fonts/Pretendard-Bold.otf"),
    "Pretendard-Medium": require("../assets/fonts/Pretendard-Medium.otf"),
    "Pretendard-SemiBold": require("../assets/fonts/Pretendard-SemiBold.otf"),
  });

  // 앱 초기화 및 상태 복원
  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();

      GoogleSignin.configure({
        forceCodeForRefreshToken: true,
        webClientId: Constants.expoConfig.extra.googleWebClientId,
        offlineAccess: true,
      });

      // 푸시 알림 초기화
      const setupNotifications = async () => {
        try {
          // 알림 권한 요청
          const { status: existingStatus } =
            await Notifications.getPermissionsAsync();
          let finalStatus = existingStatus;

          if (existingStatus !== "granted") {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
            console.log("알림 권한 요청 결과:", status);
          }

          if (finalStatus !== "granted") {
            console.log("알림 권한이 거부되었습니다.");
            return false;
          }

          const initialized = await initializeNotifications();
          if (initialized) {
            // 로그인 상태일 경우에만 푸시 토큰 발급
            const isLoggedIn = useAuthStore.getState().isLoggedIn();
            if (isLoggedIn) {
              await setupPushToken();
            }
          }
          return true;
        } catch (error) {
          console.error("푸시 알림 초기화 실패:", error);
          return false;
        }
      };
      setupNotifications();

      // 알림 응답 핸들러 설정
      const subscription = setNotificationResponseHandler((response) => {
        const data = response.notification.request.content.data;

        // 알림 타입에 따른 화면 이동
        switch (data.type) {
          case "notice":
            router.push("/notice");
            break;
          case "schedule":
            router.push("/schedule");
            break;
          case "analysis":
            router.push("/analysis");
            break;
          default:
            // 기본적으로 메인 화면으로 이동
            router.push("/(tabs)");
        }
      });

      // 자동 로그인 체크
      const isLoggedIn = useAuthStore.getState().isLoggedIn();
      if (isLoggedIn) {
        router.replace("/(tabs)");
      }

      // 컴포넌트 언마운트 시 구독 해제
      return () => {
        subscription.remove();
      };
    }
  }, [loaded]);

  return (
    <ThemeProvider value={DefaultTheme}>
      <CustomThemeProvider>
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
      </CustomThemeProvider>
    </ThemeProvider>
  );
}
