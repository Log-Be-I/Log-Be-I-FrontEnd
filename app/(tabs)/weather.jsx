import React, { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import axios from "axios";
import HourlyWeather from "../../components/weather/HourlyWeather";
import WeeklyForecast from "../../components/weather/WeeklyForecast";
import AirQuality from "../../components/weather/AirQuality";
import Constants from "expo-constants";
import Text from "../../components/common/Text";
const GANGNAM_COORDS = {
  latitude: 37.4979,
  longitude: 127.0276,
};

const WEATHER_API_KEY = Constants.expoConfig.extra.weatherApiKey;

// 날씨 데이터를 일별로 그룹화하는 함수
const groupWeatherByDay = (list) => {
  const grouped = {};

  list.forEach((item) => {
    const date = new Date(item.dt * 1000).toLocaleDateString();
    const hour = new Date(item.dt * 1000).getHours();

    if (!grouped[date]) {
      grouped[date] = {
        dt: item.dt,
        main: {
          temp_min: item.main.temp,
          temp_max: item.main.temp,
        },
        weather: [
          {
            icon: item.weather[0].icon,
          },
        ],
        morning_icon: hour >= 6 && hour < 18 ? item.weather[0].icon : null,
        evening_icon: hour >= 18 || hour < 6 ? item.weather[0].icon : null,
      };
    } else {
      // 최저/최고 기온 업데이트
      grouped[date].main.temp_min = Math.min(
        grouped[date].main.temp_min,
        item.main.temp
      );
      grouped[date].main.temp_max = Math.max(
        grouped[date].main.temp_max,
        item.main.temp
      );

      // 오전/오후 아이콘 업데이트
      if (hour >= 6 && hour < 18) {
        grouped[date].morning_icon = item.weather[0].icon;
      } else {
        grouped[date].evening_icon = item.weather[0].icon;
      }
    }
  });

  return Object.values(grouped);
};

const WeatherDetail = () => {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [hourlyData, setHourlyData] = useState(null);
  const [weeklyData, setWeeklyData] = useState(null);
  const [airData, setAirData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllWeatherData = async () => {
      try {
        console.log(
          "weather api : ",
          `https://api.openweathermap.org/data/2.5/forecast?lat=${GANGNAM_COORDS.latitude}&lon=${GANGNAM_COORDS.longitude}&appid=${WEATHER_API_KEY}&units=metric`
        );
        // 현재 날씨와 시간별 날씨
        const weeklyWeather = await axios.get(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${GANGNAM_COORDS.latitude}&lon=${GANGNAM_COORDS.longitude}&appid=${WEATHER_API_KEY}&units=metric`
        );

        setCurrentWeather(weeklyWeather.data.list[0]);
        setHourlyData(weeklyWeather.data);

        // 주간 날씨 데이터 처리
        const groupedData = groupWeatherByDay(weeklyWeather.data.list);
        setWeeklyData(groupedData);

        // 대기 질
        const airQuality = await axios.get(
          `https://api.openweathermap.org/data/2.5/air_pollution?lat=${GANGNAM_COORDS.latitude}&lon=${GANGNAM_COORDS.longitude}&appid=${WEATHER_API_KEY}`
        );

        // UV Index API 호출
        const uviResponse = await axios.get(
          `https://api.openweathermap.org/data/2.5/uvi?lat=${GANGNAM_COORDS.latitude}&lon=${GANGNAM_COORDS.longitude}&appid=${WEATHER_API_KEY}`
        );

        setAirData({
          pm10: airQuality.data.list[0].components.pm10,
          pm25: airQuality.data.list[0].components.pm2_5,
          uvi: uviResponse.data.value,
          humidity: weeklyWeather.data.list[0].main.humidity,
        });
      } catch (error) {
        console.error("Error fetching weather data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllWeatherData();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      <ScrollView style={styles.container}>
        <LinearGradient
          colors={["rgba(17, 146, 223, 0.45)", "rgba(17, 112, 223, 1)"]}
          locations={[0, 1]}
          style={styles.gradientContainer}
        >
          <HourlyWeather weatherData={hourlyData} />
        </LinearGradient>
        <LinearGradient
          colors={["rgba(17, 146, 223, 0.45)", "rgba(17, 112, 223, 1)"]}
          locations={[0, 1]}
          style={styles.gradientContainer}
        >
          <WeeklyForecast weeklyData={weeklyData} />
        </LinearGradient>
        <LinearGradient
          colors={["rgba(17, 146, 223, 0.45)", "rgba(17, 112, 223, 1)"]}
          locations={[0, 1]}
          style={styles.gradientContainer}
        >
          <AirQuality airData={airData} />
        </LinearGradient>
        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  container: {
    flex: 1,
  },
  gradientContainer: {
    borderRadius: 20,
    marginHorizontal: 16,
    marginVertical: 8,
    overflow: "hidden",
  },
  bottomPadding: {
    height: 120,
  },
});

export default WeatherDetail;
