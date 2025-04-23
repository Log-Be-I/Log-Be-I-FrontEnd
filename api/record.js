import axios from 'axios';

// 기록 삭제
export const deleteRecord = async (recordId) => {
  const response = await axios.delete(`/records/${recordId}`);

  return response.data;
};

// 기록 상세 조회
export const getRecordDetail = async (recordId) => {
  const response = await axios.get(`/records/${recordId}`);

  return response.data;
};

// 기록 전체 조회
export const getRecords = async (page, size) => {
  const response = await axios.get(`/records`, {
    params: {
      page,
      size,
    },
  });

  return response.data;
};

// 기록 수정
export const updateRecord = async (recordId, data) => {
  const response = await axios.patch(`/records/${recordId}`, data);

  return response.data;
};

// 텍스트 기록
export const createTextRecord = async (data) => {
  const response = await axios.post(`/text-records`, data);

  return response.data;
};

// 오디오 기록
export const createAudioRecord = async (data) => {
  const response = await axios.post(`/audio-records`, data);

  return response.data;
};
