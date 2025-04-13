import axios from 'axios';
import axiosInstance from '../../api/axiosInstance';

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

export const createSchedule = async (scheduleData) => {
  try {
    const response = await axiosInstance.post('/api/schedules', {
      title: scheduleData.title,
      start_date_time: scheduleData.startDate.toISOString(),
      end_date_time: scheduleData.endDate.toISOString(),
    });
    return response.data;
  } catch (error) {
    console.error('일정 생성 실패:', error);
    throw error;
  }
}; 