import { axiosWithToken } from "../axios/axios";
import { parseISO, format } from "date-fns";
import ko from "date-fns/locale";

const toKSTISOString = (dateString) => {
  const date = new Date(dateString);
  return new Date(date.getTime() + 9 * 60 * 60 * 1000).toISOString().split(".")[0];
};
// 일정 생성
export const createTextSchedule = async (data) => {
  console.log("📝 [CREATE] 일정 생성 요청 데이터:", data);
  try {
    const parsedData = {
      ...data,
      startDateTime: toKSTISOString(data.startDateTime),
      endDateTime: toKSTISOString(data.endDateTime),
    };

    // const parsedData = {
    //   ...data,
    //   startDateTime: data.startDateTime.toISOString().split(".")[0],
    //   endDateTime: data.endDateTime.toISOString().split(".")[0],
    // }

    console.log("🧪 일정 생성 데이터 (KST):", parsedData);

    const response = await axiosWithToken.post(
      "/text-schedules",
      parsedData,
    );
    return response.data;
  } catch (error) {
    console.error("일정 생성 실패:", error);
    throw error;
  }
};

// 일정 수정
export const updateSchedule = async (scheduleId, data) => {
  console.log("📝 [UPDATE] 일정 수정 요청 데이터:", data);
  try {
    const parsedData = {
      ...data,
      startDateTime: toKSTISOString(data.startTime),
      endDateTime: toKSTISOString(data.endTime),
    };
    // const parsedData = {
    //   ...data,
    //   startDateTime: data.startTime.toISOString().split(".")[0],
    //   endDateTime: data.endTime.toISOString().split(".")[0],
    // }

    console.log("🧪 일정 수정 데이터 (KST):", parsedData);

    const response = await axiosWithToken.patch(
      `/schedules/${scheduleId}`,
      parsedData
    );
    return response.data;
  } catch (error) {
    console.error("일정 수정 중 오류 발생:", error);
    throw error;
  }
};

// 일정 조회
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
    console.error("일정 조회 실패:", error);
    throw error;
  }
};


export const deleteSchedule = async (scheduleId) => {
  try {
    const response = await axiosWithToken.delete(`/schedules/${scheduleId}`);
    return response.data;
  } catch (error) {
    console.error("일정 삭제 중 오류 발생:", error);
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
