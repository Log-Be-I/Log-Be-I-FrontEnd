import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const getStatusColor = (value, type) => {
  if (type === "pm10") {
    if (value <= 30) return "#32CD32";
    if (value <= 80) return "#FFD700";
    if (value <= 150) return "#FF6B6B";
    return "#8B0000";
  } else if (type === "pm25") {
    if (value <= 15) return "#32CD32";
    if (value <= 35) return "#FFD700";
    if (value <= 75) return "#FF6B6B";
    return "#8B0000";
  }
  return "#FFFFFF";
};

const getStatus = (value, type) => {
  if (type === "pm10") {
    if (value <= 30) return "좋음";
    if (value <= 80) return "보통";
    if (value <= 150) return "나쁨";
    return "매우나쁨";
  } else if (type === "pm25") {
    if (value <= 15) return "좋음";
    if (value <= 35) return "보통";
    if (value <= 75) return "나쁨";
    return "매우나쁨";
  }
  return "측정중";
};

const getUVStatus = (uvi) => {
  if (uvi <= 3) return { status: "낮음", color: "#4CAF50" };
  if (uvi <= 6) return { status: "보통", color: "#ecc78f" };
  if (uvi <= 8) return { status: "높음", color: "#FB8C00" };
  if (uvi <= 11) return { status: "매우높음", color: "#F44336" };
  return { status: "위험", color: "#311B92" };
};

const AirQuality = ({ airData }) => {
  if (!airData) return null;

  const { pm10, pm25, uvi, humidity } = airData;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>대기 정보</Text>
      <View style={styles.infoContainer}>
        <View style={styles.row}>
          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>미세먼지</Text>
            <View style={styles.statusContainer}>
              <View
                style={[
                  styles.statusBar,
                  { backgroundColor: getStatusColor(pm10, "pm10") },
                ]}
              />
              <Text style={styles.statusText}>{getStatus(pm10, "pm10")}</Text>
            </View>
            <Text style={styles.value}>{pm10} ㎍/㎥</Text>
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>초미세먼지</Text>
            <View style={styles.statusContainer}>
              <View
                style={[
                  styles.statusBar,
                  { backgroundColor: getStatusColor(pm25, "pm25") },
                ]}
              />
              <Text style={styles.statusText}>{getStatus(pm25, "pm25")}</Text>
            </View>
            <Text style={styles.value}>{pm25} ㎍/㎥</Text>
          </View>
        </View>

        <View style={styles.bottomRow}>
          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>자외선 지수</Text>
            <Text style={styles.infoValue}>{uvi}</Text>
          </View>
          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>습도</Text>
            <Text style={styles.infoValue}>{humidity}%</Text>
          </View>
        </View>
      </View>
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
  infoContainer: {
    gap: 16,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  infoBox: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 8,
    backgroundColor: "rgba(64, 64, 64, 0.2)",
  },
  infoTitle: {
    fontSize: 16,
    color: "#FFFFFF",
    marginBottom: 8,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 8,
  },
  statusBar: {
    width: 100,
    height: 4,
    borderRadius: 2,
  },
  statusText: {
    fontSize: 14,
    color: "#FFFFFF",
  },
  value: {
    fontSize: 14,
    color: "#FFFFFF",
    opacity: 0.8,
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  infoValue: {
    fontSize: 40,
    color: "#FFFFFF",
    fontWeight: "bold",
  },
});

export default AirQuality;
