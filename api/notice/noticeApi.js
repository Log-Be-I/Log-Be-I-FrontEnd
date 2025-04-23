// api/noticeApi.js
import { axiosWithToken } from '../axios/axios';

//  1. 공지 상세 조회
export const getNoticeById = async (noticeId) => {
  try {
    const response = await axiosWithToken.get(`/notices/${noticeId}`);
    return response.data;
  } catch (error) {
    console.error('공지 상세 조회 실패:', error.response?.data || error.message);
    throw error;
  }
};

//  2. 공지 전체 조회 (페이지네이션)
export const getAllNotices = async ({ page = 1, size = 7 }) => {
  try {
    const response = await axiosWithToken.get(`/notices`, {
      params: { page, size },
    });
    return response.data;
  } catch (error) {
    console.error('공지 전체 조회 실패:', error.response?.data || error.message);
    throw error;
  }
};
