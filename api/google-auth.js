import axios from 'axios';

export const googleCode = async (data) => {
  const response = await axios.post(`/api/auth/google/code`, data);

  return response.data;
};
