import axios from 'axios';

// 일정 삭제
export const deleteSchedule = async (scheduleId) => {
  const response = await axios.delete(`/schedules/${scheduleId}`);

  return response.data;
};

// 일정 조회
export const getScheduleDetail = async (scheduleId) => {
  const response = await axios.get(`/schedules/${scheduleId}`);

  return response.data;
};

// 일정 전체 조회
export const getSchedules = async (year, month) => {
  const response = await axios.get(`/schedules`, {
    params: {
      year,
      month,
    },
  });

  return response.data;
};

// 일정 삭제

// 일정 수정
export const updateSchedule = async (scheduleId, data) => {
  const response = await axios.patch(`/schedules/${scheduleId}`, data);

  return response.data;
};

// 일정 수동 등록
export const createTextSchedule = async (data) => {
  const response = await axios.post(`/text-schedules`, data);

  return response.data;
};

// 오디오 등록
export const createAudioSchedule = async (data) => {
  const response = await axios.post(`/audio-schedules`, data);

  return response.data;
};
