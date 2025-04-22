// 회원 관련 API
import axiosInstance from "../axiosInstance";
import AsyncStorage from "@react-native-async-storage/async-storage";

//회원 등록
export const postMember = async ({ email, name, nickname, birth, region }) => {
  try {
    const res = await axiosInstance.post("/auth/register", {
      email,
      name,
      birth,
      region,
      nickname,
    });

    const token = res.headers["accessToken"];
    if (token) {
      await AsyncStorage.setItem("accessToken", token);
    }
    return token;
  } catch (error) {
    console.error("회원 등록 오류", error);
    throw error;
  }
};

//회원 정보 수정 (Patch)
export const patchMemberInfo = async (
  memberId,
  { nickname, profile, region },
  token
) => {
  const res = await axiosInstance.patch(
    `/members/${memberId}`,
    { nickname, profile, region },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};

// 로그아웃
export const logout = async (token) => {
  const res = await axiosInstance.post(
    "/auth/logout",
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return res.data;
};

// // 회원 정보 조회 (Get)
// export const getMemebrInfo = async (memberId, token) => {
//     const res = await axios.get(
//         `/members/${memberId}`,
//         {
//             headers:
//             {
//                 Authorization: `Bearer ${token}`
//             }
//         }
//     );
//     return res.data;
// };
