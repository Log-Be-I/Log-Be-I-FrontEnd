import React from "react";
import { Pressable, Text, StyleSheet } from "react-native";
import useAuthStore from "../../zustand/stores/authStore";
import { useRouter } from "expo-router";

const GoogleLoginButton = ({ promptAsync }) => {
  const { googleLogin, isLoading } = useAuthStore();
  const router = useRouter();

  const handlePress = async () => {
    try {
      console.log("🚀 Initiating Google login flow");

      // Google OAuth 프로세스 시작
      const result = await promptAsync();
      console.log("✅ Google OAuth result:", result);

      if (result?.type === "success") {
        const { code } = result.params;
        console.log("📦 Received authorization code:", code);

        // 백엔드 인증 처리
        const loginResult = await googleLogin(code);
        console.log("📥 Login result:", loginResult);

        if (loginResult.isRegistered) {
          console.log("🏠 Navigating to main screen");
          router.replace("/(tabs)");
        } else {
          console.log(
            "📝 Navigating to signup screen with data:",
            loginResult.signUpData
          );
          router.push({
            pathname: "/(onBoard)/signUp",
            params: loginResult.signUpData,
          });
        }
      } else {
        console.log("❌ Google OAuth failed:", result?.type);
      }
    } catch (error) {
      console.error("❌ Login error:", error);
      console.error("Error details:", error.message);
    }
  };

  return (
    <Pressable
      onPress={handlePress}
      style={[styles.button, isLoading && styles.disabledButton]}
      disabled={isLoading}
    >
      <Text style={styles.buttonText}>
        {isLoading ? "로그인 중..." : "Google로 로그인"}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#4285F4",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  disabledButton: {
    backgroundColor: "#cccccc",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default GoogleLoginButton;
