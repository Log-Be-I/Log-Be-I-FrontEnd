import axios from 'axios';

// 카테고리 삭제
export const deleteCategory = async (categoryId) => {
  const response = await axios.delete(`/categories/${categoryId}`);

  return response.data;
};

// 카테고리 단일 조회
export const getCategoryDetail = async (categoryId) => {
  const response = await axios.get(`/categories/${categoryId}`);

  return response.data;
};

// 카테고리 전체 조회
export const getCategories = async () => {
  const response = await axios.get(`/categories`);

  return response.data;
};

// 카테고리 수정
export const updateCategory = async (categoryId, data) => {
  const response = await axios.patch(`/categories/${categoryId}`, data);

  return response.data;
};

// 카테고리 새로 등록
export const createCategory = async (data) => {
  const response = await axios.post(`/categories`, data);

  return response.data;
};
