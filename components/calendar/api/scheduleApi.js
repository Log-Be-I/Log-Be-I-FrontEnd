import axios from 'axios';

const BASE_URL = 'YOUR_API_BASE_URL';

export const fetchSchedules = async (year, month) => {
  try {
    const token = 'YOUR_AUTH_TOKEN'; // 실제 토큰으로 대체 필요
    const response = await axios.get(`${BASE_URL}/schedules?year=${year}&month=${month}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('일정 조회 실패:', error);
    return {};
  }
}; 