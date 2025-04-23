import { axiosWithToken } from '../axios/axios';

export const getAllSchedules = async (year, month) => {
  try {
    const response = await axiosWithToken.get(`/schedules`, {
      params: {
        year,
        month,
      },
    });
    return response.data;
  } catch (error) {
    console.error('일정 조회 실패:', error);
    throw error;
  }
};

export const createTextSchedule = async (data) => {
  try {
    const response = await axiosWithToken.post('/text-schedules', data);

    return response.data;
  } catch (error) {
    console.error('일정 생성 실패:', error);
    throw error;
  }
};

export const updateSchedule = async (scheduleId, data) => {
  try {
    const response = await axiosWithToken.patch(`/schedules/${scheduleId}`, data);
    return response.data;
  } catch (error) {
    console.error('일정 수정 중 오류 발생:', error);
    throw error;
  }
}; 

export const deleteSchedule = async (scheduleId) => {
  try {
    const response = await axiosWithToken.delete(`/schedules/${scheduleId}`);

    if (!response.ok) {
      throw new Error('일정 삭제에 실패했습니다.');
    }

    return response.data; 
  } catch (error) {
    console.error('일정 삭제 중 오류 발생:', error);
    throw error;
  }
};

// 일정 조회
export const getScheduleDetail = async (scheduleId) => {
  const response = await axiosWithToken.get(`/schedules/${scheduleId}`);

  return response.data;
};


// 오디오 등록
export const createAudioSchedule = async (data) => {
  const response = await axiosWithToken.post(`/audio-schedules`, data);

  return response.data;
};