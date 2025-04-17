import axiosInstance from '../axiosInstance'; // axios 설정 import

export const getMyQuestions = async (token, page = 1, size = 4) => {
  try {
    const response = await axiosInstance.get('/questions/my', {
      params: { page, size },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log('내 문의 목록:', response.data);
    return response.data;
  } catch (error) {
    console.error('내 문의 조회 실패:', error);
    throw error;
  }
};
