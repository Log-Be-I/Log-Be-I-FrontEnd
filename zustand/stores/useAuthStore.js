import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { logout as apiLogout } from "../../api/redis";
import { setupPushToken, cleanupPushToken } from "../../utils/notifications";

const useAuthStore = create(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      isLoggedIn: () => !!get().token,
      getToken: () => get().token,
      setToken: async (token) => {
        set({ token });
        // 토큰 설정 시 푸시 토큰도 설정
        await setupPushToken();
      },
      clearToken: async () => {
        // 로그아웃 시 푸시 토큰 정리
        await cleanupPushToken();
        set({ token: null, user: null });
      },
      logout: async () => {
        try {
          const token = get().token;
          if (token) {
            await apiLogout(token);
          }
          await cleanupPushToken();
          set({ token: null, user: null });
        } catch (error) {
          console.error("로그아웃 에러:", error);
          throw error;
        }
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default useAuthStore;
