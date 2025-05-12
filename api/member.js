import { axiosWithToken, axiosWithoutToken } from "./axios/axios";

// 회원 탈퇴
export const deleteMember = async (memberId) => {
  const response = await axiosWithToken.delete(`/members/${memberId}`);
  console.log("삭제 응답 : ", response);
  return response;
};

// 회원 전체 조회
export const getMembers = async (
  page,
  size,
  sortBy,
  order,
  member_Status,
  birth,
  email,
  name
) => {
  const response = await axiosWithToken.get(`/members`, {
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
  const response = await axiosWithToken.get(`/members/${memberId}`);

  return response.data;
};

// 회원 수정
export const updateMember = async (memberId, data) => {
  console.log("📡 요청 URL:", `https://logbe-i.com/members/${memberId}`);
  console.log("📄 Params:", data); 
  const response = await axiosWithToken.patch(`/members/${memberId}`, data);

  return response.data;
};

// 알림 수신동의
export const updateNotification = async (memberId, notification) => {
  const response = await axiosWithToken.patch(
    `/members/${memberId}/notification`,
    null,
    {
      params: {
        notification,
      },
    }
  );

  return response.data;
};

// 회원 등록
export const createMember = async (data) => {
  const response = await axiosWithoutToken.post(`/members`, data);

  return response.data;
};
