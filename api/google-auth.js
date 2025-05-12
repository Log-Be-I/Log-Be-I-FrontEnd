import axios from "axios";

export const googleCode = async (data) => {
  const response = await axios.post(`/api/auth/google/code`, data);
  console.log("🔑 구글 인증 코드:", response.data);
  return response.data;
};
