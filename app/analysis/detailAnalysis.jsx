import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Icon from 'react-native-vector-icons/Ionicons';
import ExpandableReportCard from '../../components/analysis/ExpandableReportCard';
import AnalysisButton from '../../components/analysis/AnalysisButton';
import { mockReports } from '../../components/analysis/mockData';
import PlayIcon from '../../assets/analysis/playIcon.svg';
import SelectIcon from '../../assets/analysis/selectIcon.svg';
import StopIcon from '../../assets/analysis/stopIcon.svg';
import Toast from '../../components/common/Toast';
import HeaderForDetail from '../../components/analysis/HeaderForDetail';
import SidebarSlideOverlay from '../../components/sidebar/SidebarSlideOverlay';
// import { getReportById } from '../../api/analysis/analysisApi';

export default function DetailAnalysisPage() {
  const router = useRouter();
  const timeoutRef = useRef(null); // timeout 추적용 ref
  const { monthlyId } = useLocalSearchParams();
  const [report, setReport] = useState(null);
  const [playAll, setPlayAll] = useState(false);

  const [isSelectMode, setIsSelectMode] = useState(false);
  const [selectedReports, setSelectedReports] = useState([]);

  const [isReading, setIsReading] = useState(false); // Stop 버튼 활성화 여부
  const [blockedTab, setBlockedTab] = useState(false); // 탭 차단상태
  const [tabPressCount, setTabPressCount] = useState(0); // 탭 차단 카운트

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    if(monthlyId) fetchMonthlyReport(); // 월간 정보 + 주차 리스트 불러오기기
  }, [monthlyId]);

  useEffect(() => {
  }, [isReading]);

  const fetchMonthlyReport = async () => {
    // const response = await getReportAll(monthlyId);
    // setReport(response.data);
    try {
      const foundReport = mockReports.find(r => r.monthlyId === Number(monthlyId));
      if (foundReport) {
        setReport(foundReport);
      } else {
        console.warn('해당 monthlyId에 해당하는 리포트가 없습니다.');
      }
    } catch (error) {
      console.error('리포트 상세 조회 실패:', error);
    }
  };
  
  const handleToggleSelectMode = () => {
    setIsSelectMode(!isSelectMode);
    setSelectedReports([]);
  };

  const handleStartReading = () => {
    setIsReading(true);
    setBlockedTab('analysis'); // 현재 탭 차단 등록
    setTabPressCount(0);
    //선택모드는 재생 시작 시 종료
    setIsSelectMode(false);

    const isPlayAll = !isSelectMode || selectedReports.length === 0;
    setPlayAll(isPlayAll);

  // 읽을 content 리스트 추출
  const contentsToRead = isSelectMode
    ? [
      ...(selectedReports.includes(report.monthlyId) ? [report.content] : []),
      ...report.reports
        .filter(r => selectedReports.includes(r.reportId))
        .map(r => r.content),
    ]
    : [report.content, ...report.reports.map(r => r.content)];

    //여기서 Google API로 전달
  };

  const handleStopReading = () => {
    setIsReading(false);
    setBlockedTab(null); // 탭 차단 해제
    setPlayAll(false); // 재생 전체 초기화
    setSelectedReports([]); // 선택 목록도 초기화
  };

  // const handleTabPress = (tabName) => {
  //   if (isReading) {
  //     if (tabName === blockedTab) {
  //       if (tabPressCount === 0) {
  //         setTabPressCount(1);
  //       } else {
  //         setIsReading(false); // 두번째 탭에서 해재
  //         setTabPressCount(0); // 카운트 초기화
  //         router.push(`/${tabName}`); // 탭 이동
  //         report;
  //       }
  //     }
  //     return; // 다른 탭도 막힘
  //   } else {
  //     router.push(`/${tabName}`);
  //   }
  // };

  const handleProtectedAction = (action) => {
    if (isReading) {
      if (tabPressCount === 0) {
        setTabPressCount(1);
        setToastMessage('다시 한 번 누르면 이동됩니다.');
        setShowToast(true);

        timeoutRef.current = setTimeout(() => {
          setTabPressCount(0);
        }, 1000);
      } else {
        clearTimeout(timeoutRef.current); // 이전 timeout 해제
        setTabPressCount(0);
        setIsReading(false);

        requestAnimationFrame(() => {
          action(); // 오버레이 사라진 다음 실행!
        });
      }
    } else {
      action(); // 읽기 모드 아닐 때 바로 실행
    }
  };


  const handleBack = () => {
    router.back();
  };

  if (!report) return null;

  return (
    <View style={styles.container}>
      {/* <HeaderForDetail 
      handleProtectedAction={(e) => handleProtectedAction(e)}
      setModalVisible={(e) => setModalVisible(e)}
      /> */}
        <View style={styles.top}>
          <Pressable onPress={() => handleProtectedAction(handleBack)} style={styles.backButton}>
            <Icon name="chevron-back" size={24} color="#000" />
          </Pressable>
          <Text style={styles.title}>{report.title}</Text>
          <View style={styles.buttonContainer}>
            {isReading ? (
              <AnalysisButton
                SvgIcon={StopIcon}
                onPress={handleStopReading}
                iconSize={100}
              />
            ) : (
              <>
                <AnalysisButton
                  SvgIcon={PlayIcon}
                  onPress={handleStartReading}
                  iconSize={40}
                />
                <AnalysisButton
                  onPress={handleToggleSelectMode}
                  iconSize={14}
                  text={isSelectMode ? "Cancel" : "Select"}
                  SvgIcon={isSelectMode ? "" : SelectIcon}
                  textStyle={isSelectMode ? { color: "#FF9500" } : { color: "#2563ED" }}
                  />
                </>
              )}
          </View>
        </View>

        <View style={styles.border} />

        <ScrollView style={styles.content}>
          <ExpandableReportCard
            title={`${report.title} 월간 리포트`}
            content={report.content}
            alwaysOpen={true} //월간 보고서
            isSelectMode={isSelectMode} // 선택모드 일때만 체크박스 보여주기
            isSelected={playAll || selectedReports.includes(report.monthlyId)} // 이 카드가 선택되었는지 여부
            onToggleSelect={(isSelectedNow) => {
              if(isReading) return;

              setSelectedReports((prev) => 
                isSelectedNow
                  ? [...prev, report.monthlyId] // 선택 상태일 경우 추가
                  : prev.filter((id) => id !== report.monthlyId) // 선택 해제 상태일 경우 제거
              );
            }}
          />
          {report.reports?.map((item) => (
            <ExpandableReportCard
              key={item.reportId}
              title={item.title}
              content={item.content}
              isSelectMode={isSelectMode} // 선택모드 일때만 체크박스 보여주기
              isSelected={playAll || selectedReports.includes(item.reportId)} // 이 카드가 선택되었는지 여부
              onToggleSelect={(isSelectedNow) => {
                if(isReading) return;

                setSelectedReports((prev) => 
                    isSelectedNow
                    ? [...prev, item.reportId] // 선택 상태일 경우 추가
                    : prev.filter((id) => id !== item.reportId) // 선택 해제 상태일 경우 제거
                );
              }}
            />
          ))}
        </ScrollView>

        <Pressable onPress={() => isSelectMode ? onSelect(report.monthlyId) : onPress()}>
          <View style={styles.reportCard}>
            {isSelectMode && (
              <Icon
                name={selectedReports.includes(report.monthlyId)
                  ? "checkbox"
                  : "square-outline"}
                size={20}
                color="#2563ED"
                style={{ marginRight: 8 }}
              />
            )}
            <Text>{report.title}</Text>
          </View>
        </Pressable>
        <Toast
          visible={showToast}
          message={toastMessage}
          onHide={() => setShowToast(false)}
          />
        <SidebarSlideOverlay
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
        />
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerInterceptor: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: 60,
    zIndex: 1000,
  },
  top: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    marginBottom: 8,
  },
  backButton: {
    padding: 10,
    marginRight: 8,
  },
  title: {
    fontSize: 21,
    fontWeight: '600',
    color: '#82ACF1',
    flex: 1,
    right: 0,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  button: {
    minWidth: 100,
  },
  // border: {
  //   height: 1,
  //   backgroundColor: '#69BAFF',
  //   marginBottom: 16,
  // },
  content: {
    flex: 1,
  },
});
