import { axiosWithToken } from "../axios/axios"; // 기존 설정 import

export const getReportsAll = async (year) => {
  try {
    const response = await axiosWithToken.get("/reports", {
      params: { year },
    });
    // 성공 응답 처리
    console.log("연도별 리포트:", response.data.data);
    return response.data.data;
  } catch (error) {
    console.error("연도별 리포트 조회 실패:", error);
    throw error;
  }
};

// 분석 상세 조회 API
export const getReportById = async (monthlyTitle) => {
  try {
    console.log("🟢 monthlyTitle:", monthlyTitle);
    const response = await axiosWithToken.get(`/reports/detail`, {
      params: { "monthly-title": monthlyTitle },
    });
    // 성공 응답 처리
    return response.data.data;
  } catch (error) {
    console.error("리포트 개별 조회 실패:", error);
    throw error;
  }
};

export const createTTSReport = async (reportIds, signal) => {
  if (!reportIds || reportIds.length === 0) {
    console.error("❗읽을 reportIds가 없습니다. 요청을 보내지 않습니다.");
    return;
  }
  try {
    console.log("🟢 보내는 reportIds:", reportIds);
    const response = await axiosWithToken.post(`/reports/audio`, reportIds, {
      headers: {
        "Content-Type": "application/json",
      },
      signal,
    });
    return response.data;
  } catch (error) {
    if (error.name === "CanceledError" || error.name === "AbortError") {
      console.log("TTS 요청이 취소되었습니다.");
      throw new Error("AbortError");
    }
    console.error("리포트 읽기 실패:", error);
    throw error;
  }
};
