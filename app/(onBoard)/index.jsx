import { View, StyleSheet, Pressable, Alert } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Text from "../../components/common/Text";
import GoogleSigninImage from "../../assets/images/googleLogo.svg";
import LogBeIText from "../../assets/images/logBeIText.svg";
import BackgroundSVG from "../../assets/images/loginPageBackground.svg";
import * as WebBrowser from "expo-web-browser";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { axiosWithoutToken } from "../../api/axios/axios";
import { useMemberStore, useSignUpStore } from "../../zustand/stores/member";
import Constants from "expo-constants";
import * as Font from "expo-font";

WebBrowser.maybeCompleteAuthSession();

export default function Login() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  const { setMember } = useMemberStore();
  const { setSignUpState } = useSignUpStore();

  // ✅ 폰트 로딩
  useEffect(() => {
    Font.loadAsync({
      "Pretendard-Regular": require("../../assets/fonts/Pretendard-Regular.otf"),
      "Pretendard-Medium": require("../../assets/fonts/Pretendard-Medium.otf"),
      "Pretendard-Bold": require("../../assets/fonts/Pretendard-Bold.otf"),
    }).then(() => setFontsLoaded(true));
  }, []);

  if (!fontsLoaded) return null; // ✅ 로딩 전에는 렌더 안함

  const googleLogin = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const hasPlay = await GoogleSignin.hasPlayServices();
      const result = await GoogleSignin.signIn();

      const response = await axiosWithoutToken.post("api/auth/google/code", {
        code: result.data.serverAuthCode,
      });

      if (response.data.status === "login") {
        setMember(response.data.user);
        await AsyncStorage.setItem("accessToken", response.data.token);
        router.replace("/(tabs)");
      } else {
        setSignUpState({
          name: response.data.user.name,
          email: response.data.user.email,
        });
        router.push("/(onBoard)/signUp");
      }
    } catch (error) {
      console.error("로그인 에러:", error);
      setError(error.message || "로그인 중 오류가 발생했습니다.");
      Alert.alert("로그인 실패", "로그인 처리 중 문제가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <BackgroundSVG style={styles.background} />
      <View style={styles.contentContainer}>
        <LogBeIText width={120} height={40} style={styles.logo} />
        <View style={styles.loginContainer}>
          <View style={styles.titleWrapper}>
            <View style={styles.titleContainer}>
              <Text variant="bold" size={24} color="#1170DF">
                Login
              </Text>
              <View style={styles.underline} />
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <Pressable
              style={[styles.googleButton, isLoading && styles.disabledButton]}
              onPress={googleLogin}
              disabled={isLoading}
            >
              <View style={styles.googleContent}>
                <GoogleSigninImage
                  width={20}
                  height={20}
                  style={{ marginRight: 8 }}
                />
                <Text
                  variant="medium"
                  size={14}
                  color="#666"
                  style={{ flexShrink: 1 }}
                  numberOfLines={1}
                >
                  {isLoading ? "로그인 중..." : "Sign In with Google"}
                </Text>
              </View>
            </Pressable>
          </View>
          {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
        <View style={styles.footer}>
          <Text
            variant="regular"
            size={10}
            color="#666"
            style={styles.footerText}
          >
            이용약관 • 개인정보처리방침
          </Text>
          <Text variant="regular" size={10} color="#666">
            Copyright © Log Be I All rights reserved
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  errorText: { color: "red", marginTop: 10 },
  background: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
  },
  contentContainer: { flex: 1, padding: 24, justifyContent: "space-between" },
  logo: { alignSelf: "center", marginTop: 60 },
  loginContainer: { width: "100%", paddingHorizontal: 16, marginTop: -100 },
  titleWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  titleContainer: { alignItems: "flex-start" },
  underline: { width: 40, height: 2, backgroundColor: "#1170DF", marginTop: 4 },
  buttonContainer: { marginTop: 20 },
  googleButton: {
    backgroundColor: "#fff",
    borderRadius: 8,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    padding: 12,
  },
  googleContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  footer: { alignItems: "center", marginBottom: 16 },
  footerText: { marginBottom: 2 },
  disabledButton: {
    opacity: 0.7,
  },
});
