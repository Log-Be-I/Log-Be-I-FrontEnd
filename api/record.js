import { axiosWithToken } from "./axios/axios";

// 기록 삭제
export const deleteRecord = async (recordId) => {
  const response = await axiosWithToken.delete(`/records/${recordId}`);
  console.log("deleteRecord", `/records/${recordId}`);
  return response;
};

// 기록 상세 조회
export const getRecordDetail = async (recordId) => {
  const response = await axiosWithToken.get(`/records/${recordId}`);
  console.log("getRecordDetail", `/records/${recordId}`);
  const record = response.data;
  const { category, ...rest } = record;
  return {
    ...rest,
    categoryId: category?.categoryId ?? record.categoryId,
  };
};

// 기록 조회 (날짜 범위, 카테고리)
export const getRecords = async (
  page,
  size,
  startDate,
  endDate,
  categoryId
) => {
  const response = await axiosWithToken.get(`/records`, {
    params: {
      page: page,
      size: size,
      startDate: startDate, // 이미 'YYYY-MM-DD' 형식으로 변환된 문자열
      endDate: endDate, // 이미 'YYYY-MM-DD' 형식으로 변환된 문자열
      categoryId: categoryId,
    },
  });
  const mapped = (response.data.data || []).map((record) => {
    const { category, ...rest } = record;
    return {
      ...rest,
      categoryId: category?.categoryId ?? record.categoryId,
    };
  });
  return {
    data: mapped,
    pageInfo: response.data.pageInfo,
  };
};

// 기록 수정
export const updateRecord = async (recordId, data) => {
  const response = await axiosWithToken.patch(`/records/${recordId}`, data);
  console.log("Record 수정 응답 : ", response.data);
  return response.data.data;
};

// 텍스트 기록 생성
export const createTextRecord = async (data) => {
  console.log("recordPostData", data);
  const response = await axiosWithToken.post(`/text-records`, data);
  console.log("createTextRecord", `/text-records`);
  const record = response.data.data;
  const { categoryId, ...rest } = record;
  console.log("✅✅ 서버에서 등록한 데이터 : ", record);
  return record;
};

// 오디오 기록 생성
export const createAudioRecord = async (data) => {
  const response = await axiosWithToken.post(`/audio-records`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  console.log("createAudioRecord", `/audio-records`);
  const record = response.data;
  return record;
};
