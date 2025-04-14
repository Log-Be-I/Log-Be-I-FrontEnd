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
import Constants from "expo-constants";
import { makeRedirectUri } from "expo-auth-session";

export default function Login() {
  const router = useRouter();
  const { isLoading, error } = useAuthStore();

  // Google 로그인 설정을 컴포넌트 레벨에서 초기화
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: Constants.expoConfig.extra.googleClientId,
    redirectUri: makeRedirectUri({
      scheme: "com.example.app",
    }),
    scopes: ["email", "profile"],
  });

  // 실제 로그인 없이 페이지 이동
  const handleLogin2 = () => {
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
            <GoogleLoginButton promptAsync={promptAsync} />{" "}
            {/* promptAsync를 props로 전달 */}
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
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  errorText: {
    color: "red",
    marginTop: 10,
  },
  background: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
  },
  contentContainer: {
    flex: 1,
    padding: 24,
    justifyContent: "space-between",
  },
  logo: {
    alignSelf: "center",
    marginTop: 60,
  },
  loginContainer: {
    width: "100%",
    paddingHorizontal: 16,
    marginTop: -100,
  },
  titleWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
    width: "100%",
  },
  titleContainer: {
    alignItems: "flex-start",
  },
  underline: {
    width: 40,
    height: 2,
    backgroundColor: "#1170DF",
    marginTop: 4,
  },
  buttonContainer: {
    marginTop: 20,
  },
  googleButton: {
    backgroundColor: "#fff",
    borderRadius: 8,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
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
  footer: {
    alignItems: "center",
    marginBottom: 16,
  },
  footerText: {
    marginBottom: 2,
  },
});

// StyleSheet는 SafeAreaView와 무관하다.
// SafeAreaView는 UI 컴포넌트 배치를 위한 영역이고, Style Sheet는 스타일을 적용하기 위한 영역이다.
