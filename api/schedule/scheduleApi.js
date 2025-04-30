import { axiosWithToken } from "../axios/axios";
import { parseISO, format } from "date-fns";

export const getAllSchedules = async (year, month) => {
  try {
    const response = await axiosWithToken.get(`/schedules`, {
      params: {
        year,
        month,
      },
    });
    console.log("🧪 일정 전체 응답:", response.data);
    return response.data;
  } catch (error) {
    console.error("일정 조회 실패:", error);
    throw error;
  }
};

export const createTextSchedule = async (data) => {
  try {
    const formattedData = {
      ...data,
      startDateTime: new Date(data.startDateTime).toISOString().slice(0, 19),
      endDateTime: new Date(data.endDateTime).toISOString().slice(0, 19),
    };
    console.log("🧪 일정 생성 데이터:", formattedData);
    const response = await axiosWithToken.post(
      "/text-schedules",
      formattedData
    );
    console.log("🧪 post 응답:", response.data);
    return response.data;
  } catch (error) {
    console.error("일정 생성 실패:", error);
    throw error;
  }
};

export const updateSchedule = async (scheduleId, data) => {
  try {
    const start =
      typeof data.startTime === "string"
        ? parseISO(data.startTime)
        : data.startTime;
    const end =
      typeof data.endTime === "string" ? parseISO(data.endTime) : data.endTime;

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new Error("Invalid start or end DateTime provided.");
    }

    const formattedData = {
      ...data,
      startDateTime: format(start, "yyyy-MM-dd'T'HH:mm:ss"),
      endDateTime: format(end, "yyyy-MM-dd'T'HH:mm:ss"),
    };
    console.log("🧪 서버로 보내는 데이터:", formattedData);

    const response = await axiosWithToken.patch(
      `/schedules/${scheduleId}`,
      formattedData
    );
    return response.data;
  } catch (error) {
    console.error("일정 수정 중 오류 발생:", error);
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
  console.log("🧪 일정 상세 응답:", response.data);
  return response.data;
};

// 오디오 등록
export const createAudioSchedule = async (data) => {
  const response = await axiosWithToken.post(`/audio-schedules`, data);

  return response.data;
};
