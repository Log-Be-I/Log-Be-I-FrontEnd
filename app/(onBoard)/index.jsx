import { View, StyleSheet, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Text from "../../components/common/Text";
import GoogleSignin from "../../assets/images/googleLogo.svg";
import LogBeIText from "../../assets/images/logBeIText.svg";
import BackgroundSVG from "../../assets/images/loginPageBackground.svg";
import useAuthStore from "../../zustand/stores/authStore";
import GoogleLoginButton from "../../components/onBoard/GoogleLoginButton";
import * as Google from "expo-auth-session/providers/google";
import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import React from "react";

WebBrowser.maybeCompleteAuthSession();

export default function Login() {
  const router = useRouter();
  const { isLoading, error, setToken, setUser } = useAuthStore();

  const [request, response, promptAsync] = Google.useAuthRequest(
    {
      webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
      androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
      responseType: "code",
      scopes: ["email", "profile", "openid"],
      usePKCE: false,
      redirectUri: AuthSession.makeRedirectUri({ useProxy: false }),
      extraParams: {
        prompt: "consent",
        access_type: "offline",
      },
      skipCodeExchange: true,
    },
    {
      useProxy: false,
    }
  );

  const handleLogin2 = () => {
    setToken("test-token");
    setUser({
      id: "test-user-id",
      email: "test@example.com",
      name: "Test User",
      image: null,
    });
    router.replace("/(tabs)");
  };

  const handleRegister = () => {
    router.push("/(onBoard)/signUp");
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
            <View style={styles.titleContainer}>
              <Pressable onPress={handleRegister}>
                <Text variant="medium" size={24} color="#999">
                  Register
                </Text>
              </Pressable>
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <Pressable style={styles.googleButton} onPress={handleLogin2}>
              <View style={styles.googleContent}>
                <GoogleSignin width={20} height={20} />
                <Text variant="medium" size={14} color="#666">
                  {isLoading ? "로그인 중..." : "Sign In with Google"}
                </Text>
              </View>
            </Pressable>
            <GoogleLoginButton promptAsync={promptAsync} />
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
    gap: 8,
  },
  footer: { alignItems: "center", marginBottom: 16 },
  footerText: { marginBottom: 2 },
});
