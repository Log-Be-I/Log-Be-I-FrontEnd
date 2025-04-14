import React from "react";
import { TouchableOpacity, Text, StyleSheet, Pressable } from "react-native";
import useAuthStore from "../../zustand/stores/authStore";

const GoogleLoginButton = ({ promptAsync }) => {
  const { googleLogin } = useAuthStore();

  const handlePress = async () => {
    try {
      const result = await promptAsync();
      if (result?.type === "success") {
        await googleLogin(result);
      }
    } catch (error) {
      console.error("Google login error:", error);
    }
  };

  return (
    <Pressable onPress={handlePress}>
      <TouchableOpacity style={styles.button} disabled={isLoading}>
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
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default GoogleLoginButton;
