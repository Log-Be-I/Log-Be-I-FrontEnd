import axiosInstance from '../../api/axiosInstance';

export const getAllSchedules = async (year, month) => {
  try {
    const response = await axiosInstance.get(`/schedules?year=${year}&month=${month}`);
    return response.data;
  } catch (error) {
    console.error('일정 조회 실패:', error);
    throw error;
  }
};

export const createSchedule = async (scheduleData) => {
  try {
    const response = await axiosInstance.post('/text-schedules', {
      title: scheduleData.title,
      startDateTime: scheduleData.startDate.toISOString(),
      endDateTime: scheduleData.endDate.toISOString(),
    });
    return response.data;
  } catch (error) {
    console.error('일정 생성 실패:', error);
    throw error;
  }
};

export const updateSchedule = async (scheduleId, scheduleData) => {
  try {
    const response = await axiosInstance.patch(`/schedules/${scheduleId}`, {
      title: scheduleData.title,
      startDateTime: scheduleData.startTime.toISOString(),
      endDateTime: scheduleData.endTime.toISOString()
    });
    return response.data;
  } catch (error) {
    console.error('일정 수정 중 오류 발생:', error);
    throw error;
  }
}; 

export const deleteSchedule = async (scheduleId) => {
  try {
    const response = await axiosInstance.delete(`/schedules/${scheduleId}`);

    if (!response.ok) {
      throw new Error('일정 삭제에 실패했습니다.');
    }

    return response.json(); 
  } catch (error) {
    console.error('일정 삭제 중 오류 발생:', error);
    throw error;
  }
};
