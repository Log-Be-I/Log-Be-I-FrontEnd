import React, { useState, useEffect } from "react";
import { View, StyleSheet, FlatList, Pressable } from "react-native";
import Text from "../common/Text";
import { format, addHours } from "date-fns";
import { ko } from "date-fns/locale";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { getWeatherIcon } from "../../utils/weatherIcons";
import { useRouter } from "expo-router";
import axios from "axios";
import Constants from "expo-constants";

// 강남구 좌표
const GANGNAM_COORDS = {
  latitude: 37.4979,
  longitude: 127.0276,
};

const WEATHER_API_KEY = Constants.expoConfig.extra.weatherApiKey;

export default function Weather() {
  const router = useRouter();
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWeatherData();
  }, []);

  const fetchWeatherData = async () => {
    try {
      const [currentResponse, forecastResponse] = await Promise.all([
        axios.get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${GANGNAM_COORDS.latitude}&lon=${GANGNAM_COORDS.longitude}&appid=${WEATHER_API_KEY}&units=metric`
        ),
        axios.get(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${GANGNAM_COORDS.latitude}&lon=${GANGNAM_COORDS.longitude}&appid=${WEATHER_API_KEY}&units=metric`
        ),
      ]);

      setWeatherData({
        current: currentResponse.data,
        forecast: forecastResponse.data,
      });
    } catch (error) {
      console.error("Error fetching weather data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (
    loading ||
    !weatherData ||
    !weatherData.forecast?.list ||
    !weatherData.forecast.list.length
  ) {
    return (
      <View style={styles.container}>
        <View style={styles.weatherCard}>
          <View style={styles.currentWeather}>
            <View style={styles.dateContainer}>
              <Text variant="medium" size={16} color="#fff" style={styles.date}>
                {format(new Date(), "yyyy-MM-dd(E)", { locale: ko })}
              </Text>
            </View>
            <View style={styles.weatherInfo}>
              <View style={styles.weatherIconContainer}>
                <Text variant="medium" size={16} color="#fff">
                  날씨 정보를 불러오는 중...
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  }

  // 현재 한국 시간 구하기
  const now = new Date();
  const koreaTime = new Date(
    now.getTime() + now.getTimezoneOffset() * 60000 + 9 * 3600000
  );

  // 현재 시간을 정각으로 맞추지 않고 실제 시간을 사용
  const currentHour = koreaTime.getHours();
  const currentMinutes = koreaTime.getMinutes();
  const currentTime = new Date(koreaTime);
  currentTime.setHours(currentHour, currentMinutes, 0, 0);

  // 현재 시간 이후의 데이터만 필터링
  const next24Hours = weatherData.forecast.list.filter((item) => {
    // API에서 받은 UTC 시간을 한국 시간으로 변환
    const utcTime = new Date(item.dt * 1000);
    const itemTime = new Date(
      utcTime.getTime() + utcTime.getTimezoneOffset() * 60000 + 9 * 3600000
    );
    return itemTime >= currentTime && itemTime <= addHours(currentTime, 24);
  });

  // 현재 날씨 데이터 사용
  const currentWeather = weatherData.current;

  const renderHourlyItem = ({ item }) => {
    // API에서 받은 UTC 시간을 한국 시간으로 변환
    const utcTime = new Date(item.dt * 1000);
    const itemTime = new Date(
      utcTime.getTime() + utcTime.getTimezoneOffset() * 60000 + 9 * 3600000
    );

    return (
      <View style={styles.hourlyItem}>
        <Text variant="medium" size={14} color="#fff">
          {format(itemTime, "HH:mm")}
        </Text>
        <Icon
          name={getWeatherIcon(item.weather[0].icon)}
          size={32}
          color="#fff"
        />
        <Text variant="regular" size={14} color="#fff">
          {Math.round(item.main.temp)}°
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.weatherCard}>
        <Pressable
          onPress={() => router.push("(tabs)/weather")}
          style={styles.currentWeather}
        >
          <View style={styles.dateContainer}>
            <Text variant="medium" size={16} color="#fff" style={styles.date}>
              {format(currentTime, "yyyy-MM-dd(E)", { locale: ko })}
            </Text>
          </View>
          <View style={styles.weatherInfo}>
            <View style={styles.weatherIconContainer}>
              <Icon
                name={getWeatherIcon(currentWeather.weather[0].icon)}
                size={180}
                color="#fff"
              />
            </View>
            <View style={styles.temperatureContainer}>
              <View style={styles.locationContainer}>
                <Text
                  variant="medium"
                  size={18}
                  color="#fff"
                  style={styles.location}
                >
                  강남구
                </Text>
                <Text
                  variant="bold"
                  size={48}
                  color="#fff"
                  style={styles.temperature}
                >
                  {Math.round(currentWeather.main.temp)}°
                </Text>
              </View>
            </View>
          </View>
        </Pressable>

        <View style={styles.hourlyContainer}>
          <FlatList
            data={next24Hours}
            renderItem={renderHourlyItem}
            keyExtractor={(item) => item.dt.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.hourlyList}
            snapToInterval={60}
            decelerationRate="fast"
            snapToAlignment="start"
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  weatherCard: {
    backgroundColor: "#69BAFF",
    borderRadius: 20,
    padding: 16,
    gap: 20,
  },
  currentWeather: {
    gap: 24,
  },
  dateContainer: {
    alignItems: "center",
    width: "100%",
  },
  date: {
    opacity: 0.8,
  },
  weatherInfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  weatherIconContainer: {
    position: "relative",
    width: 180,
    height: 180,
    alignItems: "center",
    justifyContent: "center",
  },
  temperatureContainer: {
    flex: 1,
    marginLeft: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  locationContainer: {
    gap: 4,
    alignItems: "center",
  },
  location: {
    opacity: 0.8,
  },
  temperature: {
    lineHeight: 48,
  },
  hourlyContainer: {
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.2)",
    height: 100,
  },
  hourlyList: {
    paddingHorizontal: 8,
    gap: 12,
  },
  hourlyItem: {
    alignItems: "center",
    gap: 6,
    width: 60,
  },
});
