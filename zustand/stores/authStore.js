import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware"; // zustand의 영속성 미들웨어
import AsyncStorage from "@react-native-async-storage/async-storage"; // AsyncStorage
import * as Google from "expo-auth-session/providers/google"; // expo 구글 로그인 라이브러리
import { makeRedirectUri } from "expo-auth-session"; // expo 구글 로그인 리다이렉션 라이브러리
import * as WebBrowser from "expo-web-browser"; // expo 웹 브라우저 라이브러리
import Constants from "expo-constants"; // expo 환경 변수 라이브러리

WebBrowser.maybeCompleteAuthSession(); // 구글 로그인 완료 후 리다이렉션 처리

const useAuthStore = create(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      isLoading: false,
      error: null,
      isHydrated: false,

      setToken: (token) => set({ token }), // 토큰 설정 액션
      setUser: (user) => set({ user }), // 유저 설정 액션

      googleLogin: async (response) => {
        set({ isLoading: true, error: null }); // 로딩 시작, 에러 초기화
        try {
          if (response?.type === "success") {
            // 인증 성공시
            const { authentication } = response; // 인증 정보 추출

            // Google API를 통해 사용자 정보 가져오기
            const userInfoResponse = await fetch(
              "https://www.googleapis.com/oauth2/v2/userinfo",
              {
                headers: {
                  Authorization: `Bearer ${authentication.accessToken}`,
                },
              }
            );

            // 사용자 정보 파싱
            const userInfo = await userInfoResponse.json();
            console.log("✅ Google User Info:", userInfo);

            // 백엔드로 토큰을 보내서 검증하고 JWT 토큰 받아오기
            // const result = await api.post("/auth/google", { idToken: authentication.accessToken });
            // set({ token: result.data.token, user: result.data.user });

            // 임시로 Google 토큰을 직접 저장 (백엔드 검증 후 JWT 저장해야함)
            set({
              token: authentication.accessToken,
              user: {
                id: userInfo.id,
                email: userInfo.email,
                name: userInfo.name,
                picture: userInfo.picture,
              },
              error: null,
            });

            return true;
          }

          set({ error: "Google 로그인에 실패했습니다." });
          return false;
        } catch (error) {
          console.error("Google Login Error:", error);
          set({
            error: error.message || "Google 로그인 중 오류가 발생했습니다.",
          });
          return false;
        } finally {
          set({ isLoading: false }); // 로딩 종료
        }
      },

      logout: () => set({ token: null, user: null }), // 로그아웃 액션

      // 현재 토큰 반환 액션
      getToken: () => get().token,

      // 현재 유저 반환 액션
      getUser: () => get().user,

      // 하이드레이션 완료 설정 액션
      setHydrated: () => {
        console.log("Setting hydrated to true");
        set({ isHydrated: true });
      },
    }),
    {
      name: "auth-storage", // 저장소 이름
      storage: createJSONStorage(() => AsyncStorage), // 저장소 구현체
      onRehydrateStorage: () => (state) => {
        console.log("hydration starts", state);
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
