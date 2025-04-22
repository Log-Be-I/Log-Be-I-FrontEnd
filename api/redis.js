import axios from 'axios';

export const refresh = async () => {
  const response = await axios.post(`/auth/refresh`);

  return response.data;
};

export const logout = async () => {
  const response = await axios.post(`/auth/logout`);

  return response.data;
};
