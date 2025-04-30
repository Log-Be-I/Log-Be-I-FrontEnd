import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import Icon from "react-native-vector-icons/Ionicons";
import ExpandableReportCard from "../../components/analysis/ExpandableReportCard";
import AnalysisButton from "../../components/analysis/AnalysisButton";
import PlayIcon from "../../assets/analysis/playIcon.svg";
import SelectIcon from "../../assets/analysis/selectIcon.svg";
import StopIcon from "../../assets/analysis/stopIcon.svg";
import Toast from "../../components/common/Toast";
import HeaderForDetail from "../../components/analysis/HeaderForDetail";
import SidebarSlideOverlay from "../../components/sidebar/SidebarSlideOverlay";
import { getReportById } from "../../api/analysis/analysisApi";
import { createTTSReport } from "../../api/analysis/analysisApi";
import { Audio } from "expo-av";

export default function DetailAnalysisPage() {
  const router = useRouter();
  const timeoutRef = useRef(null); // timeout 추적용 ref
  const currentSoundRef = useRef(null); // 현재 재생중인 오디오 추적용 ref
  const { monthlyTitle } = useLocalSearchParams();
  const [reports, setReports] = useState([]);
  const [playAll, setPlayAll] = useState(false);

  const [isSelectMode, setIsSelectMode] = useState(false);
  const [selectedReports, setSelectedReports] = useState([]);

  const [isReading, setIsReading] = useState(false); // Stop 버튼 활성화 여부
  const [blockedTab, setBlockedTab] = useState(false); // 탭 차단상태
  const [tabPressCount, setTabPressCount] = useState(0); // 탭 차단 카운트

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    if (monthlyTitle) fetchReportDetail(); // 월간 정보 + 주차 리스트 불러오기기
  }, [monthlyTitle]);

  const fetchReportDetail = async () => {
    try {
      const response = await getReportById(monthlyTitle);
      setReports(response);
    } catch (error) {
      console.error("리포트 조회 실패:", error);
    }
  };

  const handleToggleSelectMode = () => {
    setIsSelectMode(!isSelectMode);
    setSelectedReports([]);
  };

  const handleStartReading = async () => {
    setIsReading(true);
    setBlockedTab("analysis"); // 현재 탭 차단 등록
    setTabPressCount(0);
    //선택모드는 재생 시작 시 종료
    setIsSelectMode(false);

    const isPlayAll = !isSelectMode || selectedReports.length === 0;
    setPlayAll(isPlayAll);

    // 읽을 content 리스트 추출
    const reportIdsToRead = isSelectMode
      ? reports
          .filter((item) => selectedReports.includes(item.reportId))
          .map((item) => item.reportId)
      : reports.map((item) => item.reportId);

    console.log("🟢 읽을 리포트 아이디 리스트:", reportIdsToRead);
    //여기서 Google API로 전달
    try {
      const audioUrls = await createTTSReport(reportIdsToRead);
      console.log("🟢 음성 파일 링크 리스트:", audioUrls);
      await playAudioFiles(audioUrls); // 오디오 재생 시작
      // 받아온 오디오를 재생 or 저장장
    } catch (error) {
      console.error("음성 파일 링크 생성 실패:", error);
    }
  };

  const handleStopReading = async () => {
    setIsReading(false);
    setBlockedTab(null); // 탭 차단 해제
    setPlayAll(false); // 재생 전체 초기화
    setSelectedReports([]); // 선택 목록도 초기화
    // 음성 중지도 구현하자.
    try {
      if (currentSoundRef.current) {
        await currentSoundRef.current.stopAsync();
        await currentSoundRef.current.unloadAsync();
        currentSoundRef.current = null;
        console.log("🛑 오디오 재생 중지됨");
      }
    } catch (error) {
      console.error("오디오 중지 실패:", error);
    }
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
        setToastMessage("다시 한 번 누르면 이동됩니다.");
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

  const playAudioFiles = async (audioUrls) => {
    try {
      for (const url of audioUrls) {
        console.log("🔊 재생 시작:", url);
        const { sound } = await Audio.Sound.createAsync({ uri: url });
        currentSoundRef.current = sound;

        await sound.playAsync();
        // 파일 하나 끝날 때까지 기다리고 다음 재생
        await new Promise((resolve) => {
          const checkFinish = (status) => {
            if (status.didJustFinish) {
              sound.unloadAsync();
              resolve();
            }
          };
          sound.setOnPlaybackStatusUpdate(checkFinish);
        });
      }
      currentSoundRef.current = null; // 모든 재생 종료 시 초기화
      console.log("✅ 전체 오디오 재생 완료");
      setIsReading(false); // 모두 재생 후 읽기 상태 해제
      setBlockedTab(false);
    } catch (error) {
      console.error("오디오 파일 재생 실패:", error);
    }
  };

  const handleBack = () => {
    router.back();
  };

  if (!reports) return null;

  return (
    <View style={styles.container}>
      {/* <HeaderForDetail 
      handleProtectedAction={(e) => handleProtectedAction(e)}
      setModalVisible={(e) => setModalVisible(e)}
      /> */}
      <View style={styles.top}>
        <Pressable
          onPress={() => handleProtectedAction(handleBack)}
          style={styles.backButton}
        >
          <Icon name="chevron-back" size={24} color="#000" />
        </Pressable>
        <Text style={styles.title}>{reports.title}</Text>
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
                text={isSelectMode ? "취소" : "선택"}
                SvgIcon={isSelectMode ? "" : SelectIcon}
                textStyle={
                  isSelectMode ? { color: "#FF9500" } : { color: "#2563ED" }
                }
              />
            </>
          )}
        </View>
      </View>

      <View style={styles.border} />

      <ScrollView style={styles.content}>
        {reports
          .slice() // 원본 reports 배열을 복사
          .sort((a, b) => {
            if (
              a.reportType === "REPORT_MONTHLY" &&
              b.reportType !== "REPORT_MONTHLY"
            )
              return -1;
            if (
              a.reportType !== "REPORT_MONTHLY" &&
              b.reportType === "REPORT_MONTHLY"
            )
              return 1;
            return 0;
          })
          .map((item) => (
            <ExpandableReportCard
              key={item.reportId}
              title={item.title}
              content={item.content}
              alwaysOpen={item.reportType === "REPORT_MONTHLY"} // 월간리포트만 항상 열기
              isSelectMode={isSelectMode}
              isSelected={playAll || selectedReports.includes(item.reportId)}
              onToggleSelect={(isSelectedNow) => {
                if (isReading) return;
                setSelectedReports((prev) =>
                  isSelectedNow
                    ? [...prev, item.reportId]
                    : prev.filter((id) => id !== item.reportId)
                );
              }}
            />
          ))}
      </ScrollView>

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
    backgroundColor: "#fff",
  },
  headerInterceptor: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: 60,
    zIndex: 1000,
  },
  top: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    marginBottom: 8,
  },
  backButton: {
    padding: 10,
    marginRight: 8,
  },
  title: {
    fontSize: 21,
    fontWeight: "600",
    color: "#82ACF1",
    flex: 1,
    right: 0,
  },
  buttonContainer: {
    flexDirection: "row",
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
