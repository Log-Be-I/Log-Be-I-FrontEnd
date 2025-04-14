import React from "react";
import { TouchableOpacity, Text, StyleSheet, Pressable } from "react-native";
import useAuthStore from "../../zustand/stores/authStore";

const GoogleLoginButton = ({ promptAsync }) => {
  const { googleLogin, isLoading } = useAuthStore();

  const handlePress = async () => {
    try {
      console.log("Google 로그인 시도");
      const result = await promptAsync();
      console.log("Google 로그인 결과:", result);

      if (result?.type === "success") {
        console.log("Google 로그인 성공, 토큰 저장 시도");
        await googleLogin(result);
        console.log("토큰 저장 완료");
      } else {
        console.log("Google 로그인 실패:", result?.type);
      }
    } catch (error) {
      console.error("Google 로그인 에러:", error);
    }
  };

  return (
    <Pressable onPress={handlePress}>
      <TouchableOpacity
        style={[styles.button, isLoading && styles.disabledButton]}
        disabled={isLoading}
      >
        {/* 로딩 상태에 따라 로그인 버튼 텍스트 변경 */}
        <Text style={styles.buttonText}>
          {isLoading ? "로그인 중..." : "Google로 로그인"}
        </Text>
      </TouchableOpacity>
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
