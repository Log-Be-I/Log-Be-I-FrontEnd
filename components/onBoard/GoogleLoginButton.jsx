// ✅ GoogleLoginButton.jsx (최종 수정본)

import React, { useEffect } from "react";
import { Pressable, Text, StyleSheet } from "react-native";
import useAuthStore from "../../zustand/stores/authStore";
import { useRouter } from "expo-router";
import * as Google from "expo-auth-session/providers/google";
// import * as AuthSession from "expo-auth-session";
import { startAsync, makeRedirectUri } from "expo-auth-session";

// AuthSession.maybeCompleteAuthSession();

const GoogleLoginButton = () => {
  const { googleLogin, isLoading } = useAuthStore();
  const router = useRouter();

  const discovery = {
    authorizationEndpoint: "https://accounts.google.com/o/oauth2/v2/auth",
    tokenEndpoint: "https://oauth2.googleapis.com/token",
  };

  const redirectUri = makeRedirectUri({ useProxy: false });

  const handleLogin = async () => {
    try {
      const authUrl =
        `${discovery.authorizationEndpoint}?` +
        new URLSearchParams({
          client_id:
            "381665725956-rmfoi0jbmi555etmjnh2c7suaa9nhinq.apps.googleusercontent.com",
          redirect_uri: redirectUri,
          response_type: "code",
          scope: "openid email profile",
          access_type: "offline",
          prompt: "consent",
        }).toString();

      const result = await startAsync({ authUrl });
      console.log("✅ Google Auth Result:", result);

      if (result.type === "success" && result.params.code) {
        const loginResult = await googleLogin(result.params.code);

        if (loginResult?.isRegistered) {
          router.replace("/(tabs)");
        } else {
          router.push({
            pathname: "/(onBoard)/signUp",
            params: loginResult.signUpData,
          });
        }
      } else {
        console.log("❌ 로그인 실패 또는 취소됨:", result);
      }
    } catch (e) {
      console.error("❌ 로그인 중 예외 발생:", e);
    }
  };

  return (
    <Pressable
      onPress={() => handleLogin()}
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
