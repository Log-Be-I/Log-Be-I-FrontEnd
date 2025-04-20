import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Icon from 'react-native-vector-icons/Ionicons';
import ReportItem from '../../components/analysis/ReportItem';
import Button from '../../components/common/button';
import { mockReports } from '../../components/analysis/mockData';
// import { getReportById } from '../../api/analysis/analysisApi';

export default function DetailAnalysisPage() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [report, setReport] = useState(null);

  useEffect(() => {
    fetchReportDetail();
  }, [id]);

  const fetchReportDetail = async () => {
    try {
      // API 구현 후 아래 주석 해제
      // const response = await getReportById(id);
      // setReport(response);

      // Mock 데이터 사용
      const foundReport = mockReports.find(r => r.id === Number(id));
      setReport(foundReport);
    } catch (error) {
      console.error('리포트 상세 조회 실패:', error);
    }
  };

  if (!report) return null;

  return (
    <View style={styles.container}>
      <View style={styles.top}>
        <Text style={styles.title}>{report.title}</Text>
        <View style={styles.buttonContainer}>
          <Button
            text="Select"
            size="small"
            leftIcon={<Icon name="mic-outline" size={20} color="#69BAFF" />}
            textStyle={{ color: "#69BAFF" }}
            style={styles.button}
          />
          <Button
            text="Select"
            size="small"
            leftIcon={<Icon name="play-outline" size={20} color="#69BAFF" />}
            textStyle={{ color: "#69BAFF" }}
            style={styles.button}
          />
        </View>
      </View>

      <View style={styles.border} />

      <ScrollView style={styles.content}>
        <ReportItem
          title={report.title}
          content={report.content}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  top: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  title: {
    fontSize: 21,
    fontWeight: '600',
    color: '#5B75B1',
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  button: {
    minWidth: 100,
  },
  border: {
    height: 1,
    backgroundColor: '#69BAFF',
    marginBottom: 16,
  },
  content: {
    flex: 1,
  },
});
