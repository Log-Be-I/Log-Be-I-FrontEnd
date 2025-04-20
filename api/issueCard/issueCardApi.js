import axiosInstance from '../axiosInstance';

export const postKeywords = async (keywords) => {
  try {
    const response = await axiosInstance.post('/keyword', {
      'keyword-name': keywords
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getKeywords = async (memberId) => {
  try {
    const response = await axiosInstance.get(`/keyword/${memberId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}; 