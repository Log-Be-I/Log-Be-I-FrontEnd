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

export const getQuestionDetail = async (token, questionId) => {
  try {
    const response = await axiosInstance.get(`/questions/${questionId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log('문의 상세 조회:', response.data);
    return response.data;
  } catch (error) {
    console.error('문의 상세 조회 실패:', error);
    throw error;
  }
};



export const postMyQuestion = async (token, memberId, title, content, questionImage = null, createdAt) => {
  try {
    const response = await axiosInstance.post(
      '/questions',
      {
        memberId,
        title,
        content,
        question_image: questionImage, // 이미지 URL 없으면 null
        createdAt: createdAt || new Date().toISOString().split('T')[0],
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log('문의 등록 성공:', response.data);
    return response.data;
  } catch (error) {
    console.error('문의 등록 실패:', error);
    throw error;
  }
};

export const updateMyQuestion = async (questionId, updatedData, token) => {
  try {
    const response = await axiosInstance.patch(`/questions/${questionId}`, updatedData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log('문의 수정 성공:', response.data);
    return response.data;
  } catch (error) {
    console.error('문의 수정 실패:', error);
    throw error;
  }
};

export const deleteMyQuestion = async (questionId, token) => {
  try {
    const response = await axiosInstance.delete(`/questions/${questionId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log('문의 삭제 성공:', response.data);
    return response.data;
  } catch (error) {
    console.error('문의 삭제 실패:', error);
    throw error;
  }
};


