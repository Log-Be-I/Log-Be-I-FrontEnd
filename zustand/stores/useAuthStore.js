import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

const useAuthStore = create(
  persist(
    (set, get) => ({
      accessToken: null,

      setToken: (token) => set({ accessToken: token }),

      clearToken: () => set({ accessToken: null }),

      isLoggedIn: () => !!get().accessToken,

      getToken: () => get().accessToken,
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default useAuthStore;
