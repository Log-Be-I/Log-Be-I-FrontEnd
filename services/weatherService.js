import axios from "axios";
import Constants from "expo-constants";

const WEATHER_API_KEY = Constants.expoConfig.extra.weatherApiKey;
const BASE_URL = "https://api.openweathermap.org/data/2.5";

export const weatherService = {
  getCurrentWeather: async (lat, lon) => {
    try {
      const response = await axios.get(`${BASE_URL}/weather`, {
        params: {
          lat,
          lon,
          appid: WEATHER_API_KEY,
          units: "metric",
          lang: "kr",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching current weather:", error);
      throw error;
    }
  },

  getHourlyForecast: async (lat, lon) => {
    try {
      const response = await axios.get(`${BASE_URL}/forecast`, {
        params: {
          lat,
          lon,
          appid: WEATHER_API_KEY,
          units: "metric",
          lang: "kr",
        },
      });

      // 다음 24시간의 데이터만 필터링
      const next24Hours = response.data.list.slice(0, 8);
      return next24Hours;
    } catch (error) {
      console.error("Error fetching hourly forecast:", error);
      throw error;
    }
  },

  getDailyForecast: async (lat, lon) => {
    try {
      const response = await axios.get(`${BASE_URL}/forecast`, {
        params: {
          lat,
          lon,
          appid: WEATHER_API_KEY,
          units: "metric",
          lang: "kr",
        },
      });
      const data = response.data.list;

      // 오늘 날짜의 데이터만 필터링
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const todayForecast = data.filter((item) => {
        const itemDate = new Date(item.dt * 1000);
        return (
          itemDate.getDate() === today.getDate() &&
          itemDate.getMonth() === today.getMonth() &&
          itemDate.getFullYear() === today.getFullYear()
        );
      });

      // 최저/최고 기온 계산
      const temps = todayForecast.map((item) => item.main.temp);
      return {
        minTemp: Math.min(...temps),
        maxTemp: Math.max(...temps),
      };
    } catch (error) {
      console.error("Error fetching daily forecast:", error);
      throw error;
    }
  },

  // 날씨 아이콘 URL 생성 함수
  getWeatherIconUrl: (iconCode) => {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  },
};
