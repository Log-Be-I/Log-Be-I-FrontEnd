import axios from 'axios';

// 문의 글 삭제
export const deleteQuestion = async (questionId) => {
  const response = axios.delete(`/questions/${questionId}`);

  return response.data;
};

// 문의 글 상세 조회
export const getQuestionDetail = async (questionId) => {
  const response = axios.get(`/questions/${questionId}`);

  return response.data;
};

// 관리자의 문의 글 전체 조회
export const getQuestions = async (page, size, sortType) => {
  const response = axios.get(`/questions/office`, {
    params: {
      page,
      size,
      sortType,
    },
  });

  return response.data;
};

// 문의 글 목록 조회
export const getMyQuestions = async (page, size) => {
  const response = axios.get(`/questions/my`, {
    params: {
      page,
      size,
    },
  });

  return response.data;
};

// 문의 글 수정
export const updateQuestion = async (questionId, data) => {
  const response = axios.patch(`/questions/${questionId}`, data);

  return response.data;
};

// 문의 글 등록
export const createQuestion = async (data) => {
  const response = axios.post(`/questions`, data);

  return response.data;
};
