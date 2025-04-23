import { View, StyleSheet, Pressable, Alert } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Text from "../../components/common/Text";
import GoogleSigninImage from "../../assets/images/googleLogo.svg";
import LogBeIText from "../../assets/images/logBeIText.svg";
import BackgroundSVG from "../../assets/images/loginPageBackground.svg";
import * as WebBrowser from "expo-web-browser";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import React, { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { axiosWithoutToken } from "../../api/axios/axios";
import { useMemberStore, useSignUpStore } from "../../zustand/stores/member";

WebBrowser.maybeCompleteAuthSession();

export default function Login() {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const { setMember } = useMemberStore();
  const { setSignUpState } = useSignUpStore();

  const googleLogin = async () => {
    console.log("클릭");
    setIsLoading(true);
    setError(null);

    try {
      await GoogleSignin.hasPlayServices();
      const result = await GoogleSignin.signIn();

      console.log("result: ", result);
      console.log("ServerAuthCode: ", result.data.serverAuthCode);

      const response = await axiosWithoutToken.post("/api/auth/google/code", {
        code: result.data.serverAuthCode,
      });

      console.log("response: ", response);

      console.log("response.data: ", response.data);

      if (response.data.status === "login") {
        setMember(response.data.user);
        console.log("로그인 성공");

        await Promise.all([
          AsyncStorage.setItem("accessToken", response.data.token),
        ]);
        router.replace("/(tabs)");
      } else {
        console.log("회원가입으로 이동합니다.");
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

  const handleLogin2 = async () => {
    await AsyncStorage.setItem("accessToken", "test-token");
    setMember({
      memberId: 0,
      name: "",
      nickname: "",
      email: "",
      region: "",
      birth: "",
      profile: "assets/sitting-nalco.png",
      notification: false,
      memberStatus: "",
      lastLoginAt: "",
    });
    router.replace("/(tabs)");
  };

  const handleRegister = () => {
    router.push("/(onBoard)/signUp");
  };

  return (
    // <ErrorBoundary>
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
            <View style={styles.titleContainer}>
              <Pressable onPress={handleRegister}>
                <Text variant="medium" size={24} color="#999">
                  Register
                </Text>
              </Pressable>
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <Pressable
              style={[styles.googleButton, isLoading && styles.disabledButton]}
              onPress={googleLogin}
              disabled={isLoading}
            >
              <View style={styles.googleContent}>
                <GoogleSigninImage width={20} height={20} />
                <Text variant="medium" size={14} color="#666">
                  {isLoading ? "로그인 중..." : "Sign In with Google"}
                </Text>
              </View>
            </Pressable>
            <Pressable onPress={handleLogin2}>
              <Text variant="medium" size={14} color="#666">
                로그인 스킵
              </Text>
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
    // {/* </ErrorBoundary> */}
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
    gap: 8,
  },
  footer: { alignItems: "center", marginBottom: 16 },
  footerText: { marginBottom: 2 },
  disabledButton: {
    opacity: 0.7,
  },
});
