import axios from "axios";
import useAuthStore from "../../zustand/stores/authStore";
import AsyncStorage from "@react-native-async-storage/async-storage";

const api = axios.create({
  baseURL: process.env.BASE_URL,
  timeout: 10000, // 요청 타임아웃 10초
});

// 요청 인터셉터 설정. 모든 요청 전에 실행
api.interceptors.request.use(
  async (config) => {
    // 인증 스토어에서 토큰 가져오기
    const token = useAuthStore.getState().getToken();

    // 토큰 있으면 요청 헤더에 추가
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error); // 오류 발생 시 Promise.reject로 반환환
  }
);

// 응답 인터셉터 설정. 모든 응답 후에 실행
// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     if (error.response && error.response.status === 401) {
//       // 401 응답 코드는 인증 실패를 의미
//       const originalRequest = error.config;
//     }
//   }
// );

export default api;
