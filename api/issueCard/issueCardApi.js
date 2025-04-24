import { axiosWithToken } from '../axios/axios';

export const postKeywords = async (data) => {
  try {
    const response = await axiosWithToken.post('/keywords', data);
    console.log("✅ 서버 응답:", response.data, response.news);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getKeywords = async () => {
  try {
    const response = await axiosWithToken.get(`/keywords`);
    console.log("✅ 키워드 조회 성공:", response.data);
    return response.data;
  } catch (error) {
    throw error;
  }
}; 