import { axiosWithToken } from "./axios/axios";

/**
 * 서버에 푸시 토큰을 등록합니다.
 * @param {string} token 푸시 토큰
 * @returns {Promise<boolean>} 등록 성공 여부
 */
export const registerPushToken = async (token) => {
  try {
    const response = await axiosWithToken.post("/api/push/register", {
      token,
    });
    console.log("푸시 토큰 서버 등록 완료:", response.data);
    return true;
  } catch (error) {
    console.error("푸시 토큰 서버 등록 실패:", error);
    return false;
  }
};

/**
 * 서버에서 푸시 토큰을 삭제합니다.
 * @param {string} token 푸시 토큰
 * @returns {Promise<boolean>} 삭제 성공 여부
 */
export const unregisterPushToken = async (token) => {
  try {
    const response = await axiosWithToken.post("/api/push/unregister", {
      token,
    });
    console.log("푸시 토큰 서버 삭제 완료:", response.data);
    return true;
  } catch (error) {
    console.error("푸시 토큰 서버 삭제 실패:", error);
    return false;
  }
};
