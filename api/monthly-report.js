import axios from 'axios';

export const getMonthlyReports = async (year) => {
  const response = await axios.get(`/monthly-reports`, {
    params: {
      year,
    },
  });

  return response.data;
};

export const getMonthlyReportDetail = async (monthlyId) => {
  const response = await axios.get(`/monthly-reports/${monthlyId}`);

  return response.data;
};
