import { create } from "zustand";
import { persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

// 프로필용 스토어
export const useMemberStore = create(
  persist(
    (set) => ({
      member: {
        memberId: 0,
        name: "",
        nickname: "",
        email: "",
        region: "",
        birth: "",
        profile: "",
        notification: false,
        memberStatus: "",
        lastLoginAt: "",
      },
      setMember: (newState) =>
        set((state) => ({ member: { ...state.member, ...newState } })),
      clearMember: () =>
        set({
          member: {
            memberId: 0,
            name: "",
            nickname: "",
            email: "",
            region: "",
            birth: "",
            profile: "",
            notification: false,
            memberStatus: "",
            lastLoginAt: "",
          },
        }),
    }),
    {
      name: "member-storage", // AsyncStorage에 저장될 key 이름
      getStorage: () => AsyncStorage,
    }
  )
);

// 회원가입용 스토어
export const useSignUpStore = create((set) => ({
  signUpState: {
    name: "",
    nickname: "",
    email: "",
    region: "",
    birth: "",
    profile: "assets/sitting-nalco.png",
    notification: false,
  },
  setSignUpState: (newState) =>
    set((state) => ({ signUpState: { ...state.signUpState, ...newState } })),
}));
