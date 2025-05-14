import axios from "axios";
import { axiosWithToken } from "./axios/axios";

// 카테고리 삭제
export const deleteCategory = async (categoryId) => {
  const response = await axiosWithToken.delete(`/categories/${categoryId}`);

  return response.data;
};

// 카테고리 단일 조회
export const getCategoryDetail = async (categoryId) => {
  const response = await axiosWithToken.get(`/categories/${categoryId}`);

  return response.data;
};

// 카테고리 전체 조회
export const getCategories = async () => {
  const response = await axiosWithToken.get(`/categories/my`);
  console.log(response.data);
  return response.data;
};

// 카테고리 수정
export const updateCategory = async (categoryId, data) => {
  const response = await axiosWithToken.patch(
    `/categories/${categoryId}`,
    data
  );

  return response.data;
};

// 카테고리 새로 등록
export const createCategory = async (data) => {
  const response = await axiosWithToken.post(`/categories`, data);

  return response.data;
};
