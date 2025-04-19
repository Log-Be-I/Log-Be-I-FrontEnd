import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware"; // zustand의 영속성 미들웨어
import AsyncStorage from "@react-native-async-storage/async-storage"; // AsyncStorage
import * as Google from "expo-auth-session/providers/google"; // expo 구글 로그인 라이브러리
import { makeRedirectUri } from "expo-auth-session"; // expo 구글 로그인 리다이렉션 라이브러리
import * as WebBrowser from "expo-web-browser"; // expo 웹 브라우저 라이브러리
import Constants from "expo-constants"; // expo 환경 변수 라이브러리
import axios from "axios";
import { BASE_URL } from "@env";

WebBrowser.maybeCompleteAuthSession(); // 구글 로그인 완료 후 리다이렉션 처리

const useAuthStore = create(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      isLoading: false,
      error: null,
      isHydrated: false,

      // 토큰 설정 액션
      setToken: (token) => {
        console.log("✅ Token set:", token);
        set({ token });
      },

      // 유저 설정 액션
      setUser: (user) => {
        console.log("✅ User set:", user);
        set({ user });
      },

      // Google 로그인 처리
      googleLogin: async (code) => {
        console.log("✅ Starting Google login with code");
        set({ isLoading: true, error: null });

        try {
          // 백엔드로 authorization code 전송
          console.log("📤 Sending code to backend");
          const response = await axios.post(
            `${BASE_URL}/api/auth/google/code`,
            { code },
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          console.log("📥 Received backend response : ", response);

          // 응답 헤더에서 accessToken 확인
          // const accessToken = response.headers["accesstoken"];

          if (response.data.status === "login") {
            console.log("✅ Login successful - User is registered");
            // 기존 회원인 경우
            set({
              token: response.data.token,
              user: response.data.user,
              error: null,
            });
            return { isRegistered: true };
          } else if (response.data.status === "register") {
            console.log("ℹ️ User needs to register");
            // 회원가입이 필요한 경우
            return {
              isRegistered: false,
              signUpData: {
                email: response.data.user.email,
                name: response.data.user.name,
              },
            };
          }
        } catch (error) {
          console.error("❌ Google Login Error:", error);
          set({
            error: error.message || "Google 로그인 중 오류가 발생했습니다.",
          });
          return { isRegistered: false, error: error.message };
        } finally {
          set({ isLoading: false });
        }
      },

      // 로그아웃 액션
      logout: () => {
        console.log("🚪 Logging out");
        set({ token: null, user: null });
      },

      // 현재 토큰 반환 액션
      getToken: () => get().token,

      // 현재 유저 반환 액션
      getUser: () => get().user,

      // 하이드레이션 완료 설정 액션
      setHydrated: () => {
        console.log("💾 Setting hydrated to true");
        set({ isHydrated: true });
      },
    }),
    {
      name: "auth-storage", // 저장소 이름
      storage: createJSONStorage(() => AsyncStorage), // 저장소 구현체
      onRehydrateStorage: () => (state) => {
        console.log("💾 Hydration starts", state);
        state?.setHydrated();
      },
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isHydrated: state.isHydrated,
      }),
    }
  )
);

export default useAuthStore;
