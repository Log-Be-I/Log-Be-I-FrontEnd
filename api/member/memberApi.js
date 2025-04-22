// 회원 관련 API 
import { axiosWithToken } from '../axios/axios';
//회원 등록
// 회원 등록
export const createMember = async (data) => {
    const response = await axiosWithToken.post(`/members`, data);
  
    return response.data;
  };

//회원 정보 수정 (Patch)
export const updateMember = async (memberId, data) => {
    const response = await axiosWithToken.patch(`/members/${memberId}`, data);
  
    return response.data;
  };

// 로그아웃
export const logout = async (token) => {
    const res = await axiosInstance.post(
        '/auth/logout', 
        {}, 
        {
            headers: { Authorization: `Bearer ${token}` }
        }
    );
    return res.data;
};

// 회원 단일 조회
export const getMemberDetail = async (memberId) => {
    const response = await axiosWithToken.get(`/members/${memberId}`);
  
    return response.data;
  };

  // 회원 전체 조회
export const getMembers = async (page, size, sortBy, order, member_Status, birth, email, name) => {
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

  // 회원 삭제
export const deleteMember = async (memberId) => {
    const response = await axiosWithToken.delete(`/members/${memberId}`);
  
    return response.data;
  };

  // 알림 수신동의
export const updateNotification = async (memberId, notification) => {
    const response = await axiosWithToken.patch(`/members/${memberId}/notification`, null, {
      params: {
        notification,
      },
    });
  
    return response.data;
  };
  