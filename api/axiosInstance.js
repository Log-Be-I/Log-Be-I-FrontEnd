// Axios 기본 설정
import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:8080', // .env로 관리하면 좋다.
    headers: {
        'Content-Type': 'application/json',
    },
});

export default axiosInstance;

