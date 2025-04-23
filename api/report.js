import axios from 'axios';

export const createReport = async (data) => {
  const response = await axios.post(`/reports`, data);

  return response.data;
};

export const createTTSReport = async (text) => {
  const response = await axios.post(`/reports`, null, {
    params: {
      text,
    },
  });

  return response.data;
};
