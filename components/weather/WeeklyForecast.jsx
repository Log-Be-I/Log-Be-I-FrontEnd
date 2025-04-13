import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

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

const WeeklyForecast = ({ weeklyData }) => {
  if (!weeklyData) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>주간 날씨</Text>
      {weeklyData.map((day, index) => {
        // Unix timestamp를 밀리초로 변환
        const date = new Date(day.dt * 1000);

        return (
          <View key={index} style={styles.dayContainer}>
            <Text style={styles.dayText}>
              {format(date, "EEEE", { locale: ko })}
            </Text>
            <View style={styles.iconContainer}>
              <MaterialCommunityIcons
                name={getWeatherIcon(day.morning_icon)}
                size={24}
                color="#FFFFFF"
              />
              <MaterialCommunityIcons
                name={getWeatherIcon(day.evening_icon)}
                size={24}
                color="#FFFFFF"
              />
            </View>
            <Text style={styles.tempText}>
              {Math.round(day.main.temp_min)}° /{" "}
              <Text style={styles.maxTemp}>
                {Math.round(day.main.temp_max)}°
              </Text>
            </Text>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    width: "100%",
  },
  title: {
    fontSize: 18,
    color: "#FFFFFF",
    marginBottom: 20,
    fontWeight: "bold",
  },
  dayContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  dayText: {
    flex: 1,
    fontSize: 16,
    color: "#FFFFFF",
    paddingLeft: 20,
  },
  iconContainer: {
    flex: 1.5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    paddingRight: 20,
    gap: 8,
  },
  tempText: {
    flex: 1,
    fontSize: 16,
    color: "#FFFFFF",
    textAlign: "right",
    paddingRight: 20,
  },
  maxTemp: {
    color: "#FF6B6B",
  },
});

export default WeeklyForecast;
