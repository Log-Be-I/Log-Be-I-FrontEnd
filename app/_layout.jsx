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

// Keep the splash screen visible while we fetch resources
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
  const segments = useSegments();
  const { token, isHydrated } = useAuthStore();
  const [isReady, setIsReady] = useState(false);

  // 앱 초기화 및 상태 복원
  useEffect(() => {
    async function prepare() {
      try {
        if (loaded && isHydrated) {
          console.log("App State:", { loaded, isHydrated, hasToken: !!token });
          await SplashScreen.hideAsync();
          setIsReady(true);
        }
      } catch (e) {
        console.warn("Initialization error:", e);
      }
    }

    prepare();
  }, [loaded, isHydrated]);

  // 라우팅 처리
  useEffect(() => {
    if (!isReady) return;

    const inAuthGroup = segments[0] === "(onBoard)";
    console.log("Navigation State:", {
      hasToken: !!token,
      inAuthGroup,
      currentPath: segments.join("/"),
    });

    if (!token && !inAuthGroup) {
      router.replace("/(onBoard)");
    } else if (token && inAuthGroup) {
      router.replace("/(tabs)");
    }
  }, [isReady, token, segments]);

  // 로딩 화면
  if (!isReady || !loaded || !isHydrated) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#fff",
        }}
      >
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
