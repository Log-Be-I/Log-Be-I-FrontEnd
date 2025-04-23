import { create } from "zustand";

// 프로필용 스토어
export const useMemberStore = create((set) => ({
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
}));

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
