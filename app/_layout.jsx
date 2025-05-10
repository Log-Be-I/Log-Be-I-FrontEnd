import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";
import { ThemeProvider as CustomThemeProvider } from "../context/ThemeContext";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import Constants from "expo-constants";
import useAuthStore from "../zustand/stores/useAuthStore";

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

      // 자동 로그인 체크
      const isLoggedIn = useAuthStore.getState().isLoggedIn();
      if (isLoggedIn) {
        router.replace("/(tabs)");
      }
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
