import { useMemberStore } from "./member";

export const useTestUser = () => {
  useMemberStore.setState({
    token: `test-token`,
    member: {
      memberId: 1,
      name: "홍길동",
      nickname: "길동이",
      email: "hong@test.com",
      region: "서울시 강남구",
      birth: "1990-01-01",
      profile: "assets/sitting-nalco.png",
      notification: true,
      memberStatus: "ACTIVE",
      lastLoginAt: new Date().toISOString(),
    },
    isHydrated: true,
  });

  console.log("✅ 테스트 유저 데이터가 주입되었습니다!");
};
