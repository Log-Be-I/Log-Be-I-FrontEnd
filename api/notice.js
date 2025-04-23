import axios from 'axios';

// 공지사항 삭제
export const deleteNotice = async (noticeId) => {
  const response = await axios.delete(`/notices/${noticeId}`);

  return response.data;
};

// 공지사항 전체 목록 조회
export const getNotices = async (page, size) => {
  const response = await axios.get(`/notices`, {
    params: {
      page,
      size,
    },
  });

  return response.data;
};

// 공지사항 상세 조회
export const getNoticeDetail = async (noticeId) => {
  const response = await axios.get(`/notices/${noticeId}`);

  return response.data;
};

// 공지사항 수정
export const updateNotice = async (noticeId, data) => {
  const response = await axios.patch(`/notices/${noticeId}`, data);

  return response.data;
};

// 공지사항 등록
export const createNotice = async (data) => {
  const response = await axios.post(`/notices`, data);

  return response.data;
};
