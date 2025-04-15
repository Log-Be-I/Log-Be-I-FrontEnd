import React from "react";
import { TouchableOpacity, Text, StyleSheet, Pressable } from "react-native";
import useAuthStore from "../../zustand/stores/authStore";
import { useRouter } from "expo-router";

const GoogleLoginButton = ({ promptAsync }) => {
  const { googleLogin, isLoading } = useAuthStore();
  const router = useRouter();

  const handlePress = async () => {
    try {
      console.log("Google 로그인 시도");
      const result = await promptAsync();
      console.log("Google 로그인 결과:", result);

      if (result?.type === "success") {
        console.log("Google 로그인 성공, 토큰 저장 시도");
        const loginSuccess = await googleLogin(result);
        console.log("토큰 저장 완료:", loginSuccess);

        if (loginSuccess) {
          console.log("메인 화면으로 이동");
          router.replace("/(tabs)");
        }
      } else {
        console.log("Google 로그인 실패:", result?.type);
      }
    } catch (error) {
      console.error("Google 로그인 에러:", error);
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
