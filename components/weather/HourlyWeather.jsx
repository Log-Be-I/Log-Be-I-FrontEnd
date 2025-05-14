import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { format, addHours } from "date-fns";
import { ko } from "date-fns/locale";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const getWeatherIcon = (iconCode) => {
  const iconMap = {
    "01d": "weather-sunny",
    "01n": "weather-night",
    "02d": "weather-partly-cloudy",
    "02n": "weather-night-partly-cloudy",
    "03d": "weather-cloudy",
    "03n": "weather-cloudy",
    "04d": "weather-cloudy",
    "04n": "weather-cloudy",
    "09d": "weather-pouring",
    "09n": "weather-pouring",
    "10d": "weather-rainy",
    "10n": "weather-rainy",
    "11d": "weather-lightning-rainy",
    "11n": "weather-lightning-rainy",
    "13d": "weather-snowy",
    "13n": "weather-snowy",
    "50d": "weather-fog",
    "50n": "weather-fog",
  };
  return iconMap[iconCode] || "weather-cloudy";
};

const HourlyWeather = ({ weatherData }) => {
  if (!weatherData || !weatherData.list || !weatherData.list.length)
    return null;

  // 현재 한국 시간 구하기
  const now = new Date();
  const koreaTime = new Date(
    now.getTime() + now.getTimezoneOffset() * 60000 + 9 * 3600000
  );

  // 현재 시간을 정각으로 맞추기
  koreaTime.setMinutes(0);
  koreaTime.setSeconds(0);
  koreaTime.setMilliseconds(0);

  const currentWeather = weatherData.list[0];

  if (
    !currentWeather ||
    !currentWeather.weather ||
    !currentWeather.weather[0] ||
    !currentWeather.main
  ) {
    return null;
  }

  // 다음 24시간 동안의 3시간 간격 데이터 필터링
  const next24Hours = weatherData.list.filter((item) => {
    const itemTime = new Date(item.dt * 1000);
    return itemTime >= koreaTime && itemTime <= addHours(koreaTime, 24);
  });

  return (
    <View style={styles.container}>
      <Text style={styles.date}>
        {format(koreaTime, "yyyy-MM-dd(E)", { locale: ko })}
      </Text>
      <MaterialCommunityIcons
        name={getWeatherIcon(currentWeather.weather[0].icon)}
        size={80}
        color="#FFFFFF"
      />
      <Text style={styles.temperature}>
        {Math.round(currentWeather.main.temp)}°
      </Text>
      <Text style={styles.location}>서울특별시 강남구</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.hourlyContainer}
      >
        {next24Hours.map((item, index) => {
          if (
            !item ||
            !item.weather ||
            !item.weather[0] ||
            !item.main ||
            !item.dt
          ) {
            return null;
          }

          const itemTime = new Date(item.dt * 1000);

          return (
            <View key={index} style={styles.hourlyItem}>
              <Text style={styles.hourText}>{format(itemTime, "HH:00")}</Text>
              <MaterialCommunityIcons
                name={getWeatherIcon(item.weather[0].icon)}
                size={24}
                color="#FFFFFF"
              />
              <Text style={styles.hourTemp}>{Math.round(item.main.temp)}°</Text>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    padding: 20,
  },
  date: {
    fontSize: 16,
    color: "#FFFFFF",
    marginBottom: 20,
  },
  temperature: {
    fontSize: 64,
    color: "#FFFFFF",
    fontWeight: "bold",
    marginVertical: 10,
  },
  location: {
    fontSize: 16,
    color: "#FFFFFF",
    marginBottom: 20,
  },
  hourlyContainer: {
    marginTop: 20,
  },
  hourlyItem: {
    alignItems: "center",
    marginHorizontal: 15,
  },
  hourText: {
    fontSize: 14,
    color: "#FFFFFF",
    marginBottom: 8,
  },
  hourTemp: {
    fontSize: 14,
    color: "#FFFFFF",
    marginTop: 8,
  },
});

export default HourlyWeather;
