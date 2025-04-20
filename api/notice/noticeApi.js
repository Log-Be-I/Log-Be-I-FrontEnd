// api/noticeApi.js
import axiosInstance from './axiosInstance';

//  1. 공지 상세 조회
export const getNoticeById = async (noticeId, token) => {
  try {
    const response = await axiosInstance.get(`/notices/${noticeId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('공지 상세 조회 실패:', error.response?.data || error.message);
    throw error;
  }
};

//  2. 공지 전체 조회 (페이지네이션)
export const getAllNotices = async ({ page = 0, size = 7, token }) => {
  try {
    const response = await axiosInstance.get(`/notices?page=${page}&size=${size}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('공지 전체 조회 실패:', error.response?.data || error.message);
    throw error;
  }
};
