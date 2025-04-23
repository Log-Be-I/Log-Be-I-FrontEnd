import { axiosWithToken } from '../axios/axios'; // 기존 설정 import

export const getReportsAll = async (token, year) => {
  try {
    const response = await axiosWithToken.get('/reports', {
      params: { year },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // 성공 응답 처리
    console.log('연도별 리포트:', response.data);
    return response.data;
  } catch (error) {
    console.error('연도별 리포트 조회 실패:', error);
    throw error;
  }
};

// 분석 상세 조회 API
export const getReportById = async (token, reportId) => {
    try {
      const response = await axiosWithToken.get(`/reports/${reportId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      // 성공 응답 처리
      console.log('개별 리포트:', response.data);
      return response.data;
    } catch (error) {
      console.error('리포트 개별 조회 실패:', error);
      throw error;
    }
  };
