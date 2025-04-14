import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import "react-native-reanimated";
import { ThemeProvider as CustomThemeProvider } from "../context/ThemeContext";
import { ActivityIndicator, View } from "react-native";
import useAuthStore from "../zustand/stores/authStore";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// 인증 상태에 따라 리다이렉션 처리
export default function RootLayout() {
  const [loaded] = useFonts({
    Pretendard: require("../assets/fonts/Pretendard-Regular.otf"),
    "Pretendard-Bold": require("../assets/fonts/Pretendard-Bold.otf"),
    "Pretendard-Medium": require("../assets/fonts/Pretendard-Medium.otf"),
    "Pretendard-SemiBold": require("../assets/fonts/Pretendard-SemiBold.otf"),
  });

  const router = useRouter();
  const segments = useSegments(); // 현재 경로 세그먼트 가져오기
  const { token, isHydrated } = useAuthStore(); // 인증 스토어에서 토큰, 하이드레이션 상태 가져오기

  // AsyncStorage에서 상태 복원 대기
  useEffect(() => {
    // 폰트가 로드되고 상태가 하이드레이션 되었을 때만 실행행
    if (loaded && isHydrated) {
      // 스플래시 스크린 숨기기기
      SplashScreen.hideAsync();

      const inAuthGroup = segments[0] === "(onBoard)";

      if (!token && !inAuthGroup) {
        // 토큰이 없고 인증 그룹에 있으면 로그인 화면으로 리다이렉션
        router.replace("/(onBoard)");
      } else if (token && inAuthGroup) {
        // 토큰이 있고 인증 그룹에 있으면 메인화면으로 리다이렉션
        router.replace("/(tabs)");
      }
    }
  }, [loaded, isHydrated, token, segments, router]);

  // 폰트나 하이드레이션이 로드되지 않았으면 로딩중 표시
  if (!loaded || !isHydrated) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#1170DF" />
      </View>
    );
  }

  return (
    <CustomThemeProvider>
      <ThemeProvider value={DefaultTheme}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(onBoard)" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="schedule" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </CustomThemeProvider>
  );
}
