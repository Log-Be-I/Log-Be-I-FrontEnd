import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { useRouter } from "expo-router";
import YearDropdown from "../../components/analysis/YearDropdown";
import ReportItem from "../../components/analysis/ReportItem";
import Icon from "react-native-vector-icons/Ionicons";
import Header from "../../components/common/Header";
import { getReportsAll } from "../../api/analysis/analysisApi";

export default function AnalysisPage() {
  const router = useRouter();
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [reports, setReports] = useState([]);

  useEffect(() => {
    fetchYearlyReports();
  }, [selectedYear]);

  const fetchYearlyReports = async () => {
    try {
      // API 구현 후 아래 주석 해제
      const response = await getReportsAll(selectedYear);
      setReports(response);
      console.log("리포트 조회 성공:", response);
    } catch (error) {
      console.error("리포트 조회 실패:", error);
    }
  };

  const handleReportPress = (monthlyTitle) => {
    router.push(`/analysis/detailAnalysis?monthlyTitle=${monthlyTitle}`);
  };

  const handleBack = () => {
    router.back();
  };

  console.log("🟢 reports 데이터 확인:", reports);
  return (
    <View style={styles.container}>
      {/* <Header /> */}
      <View style={styles.headerContainer}>
        <Pressable onPress={handleBack} style={styles.backButton}>
          <Icon name="chevron-back" size={24} color="#000" />
        </Pressable>
        <Text style={styles.headerTitle}>Report</Text>
      </View>

      <YearDropdown
        selectedYear={selectedYear}
        onSelect={setSelectedYear}
        style={styles.dropdown}
      />

      <ScrollView style={styles.middle}>
        {reports.map((report) => (
          <ReportItem
            key={report.monthlyTitle}
            title={report.monthlyTitle}
            onPress={() => handleReportPress(report.monthlyTitle)}
          />
        ))}
      </ScrollView>

      <View style={styles.bottom}>{/* Footer will be rendered here */}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  backButton: {
    padding: 10,
    marginLeft: 10,
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 25,
    fontWeight: "600",
    marginRight: 44, // backButton width + padding to center title
    color: "#82ACF1",
  },
  middle: {
    flex: 1,
  },
  dropdown: {
    position: "center",
    transform: [{ translateY: -12 }],
    width: 80,
  },
});
