import axios from 'axios';

// keyword 조회
export const getKeywords = async () => {
  const response = await axios.get(`/keywords`);

  return response.data;
};

// keyword 등록
export const createKeyword = async (data) => {
  const response = await axios.post(`/keywords`, data);

  return response.data;
};
