import axios from 'axios';

// 회원 삭제
export const deleteMember = async (memberId) => {
  const response = await axios.delete(`/members/${memberId}`);

  return response.data;
};

// 회원 전체 조회
export const getMembers = async (page, size, sortBy, order, member_Status, birth, email, name) => {
  const response = await axios.get(`/members`, {
    params: {
      page,
      size,
      sortBy,
      order,
      member_Status,
      birth,
      email,
      name,
    },
  });

  return response.data;
};

// 회원 단일 조회
export const getMemberDetail = async (memberId) => {
  const response = await axios.get(`/members/${memberId}`);

  return response.data;
};

// 회원 수정
export const updateMember = async (memberId, data) => {
  const response = await axios.patch(`/members/${memberId}`, data);

  return response.data;
};

// 알림 수신동의
export const updateNotification = async (memberId, notification) => {
  const response = await axios.patch(`/members/${memberId}/notification`, null, {
    params: {
      notification,
    },
  });

  return response.data;
};

// 회원 등록
export const createMember = async (data) => {
  const response = await axios.post(`/members`, data);

  return response.data;
};
