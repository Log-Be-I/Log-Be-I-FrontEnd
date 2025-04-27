import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";

// 기본 axios 인스턴스 (토큰 불필요)
export const axiosWithoutToken = axios.create({
  baseURL: Constants.expoConfig.extra.apiUrl?.replace(/\/+$/, ""),
});

// 토큰이 필요한 axios 인스턴스
export const axiosWithToken = axios.create({
  baseURL: Constants.expoConfig.extra.apiUrl?.replace(/\/+$/, ""),


// 토큰이 필요한 요청에 대한 인터셉터 설정
axiosWithToken.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("accessToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
