import axios from 'axios';

// 답변 삭제
export const deleteAnswer = async (questionId, answerId) => {
  const response = await axios.delete(`/questions/${questionId}/answers/${answerId}`);

  return response.data;
};

// 답변 수정
export const updateAnswer = async (questionId, answerId, data) => {
  const response = await axios.patch(`/questions/${questionId}/answers/${answerId}`, data);

  return response.data;
};

// 답변 등록
export const createAnswer = async (questionId, data) => {
  const response = await axios.post(`/questions/${questionId}/answers`, data);

  return response.data;
};
