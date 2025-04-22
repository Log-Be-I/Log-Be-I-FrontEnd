import { axiosWithToken } from '../axios/axios';

export const postKeywords = async (data) => {
  try {
    const response = await axiosWithToken.post('/keywords', data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getKeywords = async (memberId) => {
  try {
    const response = await axiosWithToken.get(`/keywords/${memberId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}; 