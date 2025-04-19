// Axios 기본 설정
import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:8080', // .env로 관리하면 좋다.
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosInstance.interceptors.request.use(
    async (config) => {
        const token = await AsyncStorage.getItem('token'); // 또는 Zustand 등에서 가져오기기
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;

