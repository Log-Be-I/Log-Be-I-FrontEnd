import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useRouter, useLocalSearchParams, usePathname } from "expo-router";
import Icon from "react-native-vector-icons/Ionicons";
import ExpandableReportCard from "../../components/analysis/ExpandableReportCard";
import AnalysisButton from "../../components/analysis/AnalysisButton";
import PlayIcon from "../../assets/analysis/playIcon.svg";
import SelectIcon from "../../assets/analysis/selectIcon.svg";
import StopIcon from "../../assets/analysis/stopIcon.svg";
import BriefingToast from "../../components/analysis/BriefingToast";
import HeaderForDetail from "../../components/analysis/HeaderForDetail";
import SidebarSlideOverlay from "../../components/sidebar/SidebarSlideOverlay";
import { getReportById } from "../../api/analysis/analysisApi";
import { createTTSReport } from "../../api/analysis/analysisApi";
import { Audio } from "expo-av";
import useAudioStore from "../../zustand/stores/useAudioStore";
import { useAuthStore } from "../../zustand/stores/useAuthStore";

export default function DetailAnalysisPage() {
  const router = useRouter();
  const pathname = usePathname();
  const timeoutRef = useRef(null);
  const { monthlyTitle } = useLocalSearchParams();
  const [reports, setReports] = useState([]);
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [tabPressCount, setTabPressCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);
  const currentPathRef = useRef(pathname);
  const abortControllerRef = useRef(null);
  const isComponentMountedRef = useRef(true);

  const {
    isPlaying,
    selectedReports,
    playAll,
    currentSound,
    setCurrentSound,
    startPlaying,
    stopPlaying,
    toggleReportSelection,
    clearSelection,
    setPlayAll: setAudioStorePlayAll,
  } = useAudioStore();

  useEffect(() => {
    if (monthlyTitle) fetchReportDetail();
  }, [monthlyTitle]);

  useEffect(() => {
    return () => {
      isComponentMountedRef.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      stopPlaying();
    };
  }, []);

  // 경로 변경 감지
  useEffect(() => {
    if (isRequesting && currentPathRef.current !== pathname) {
      console.log("경로가 변경되어 요청을 취소합니다.");
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      setIsRequesting(false);
      setIsLoading(false);
      stopPlaying();
      setToastMessage("재생이 취소되었습니다.");
      setShowToast(true);
    }
  }, [pathname]);

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
    clearSelection();
  };

  const playAudioFiles = async (audioUrls) => {
    if (!isComponentMountedRef.current) return;

    try {
      for (const url of audioUrls) {
        if (
          !isComponentMountedRef.current ||
          abortControllerRef.current?.signal.aborted
        ) {
          throw new Error("AbortError");
        }

        console.log("🔊 재생 시작:", url);
        const { sound } = await Audio.Sound.createAsync({ uri: url });

        if (!isComponentMountedRef.current) {
          await sound.unloadAsync();
          throw new Error("AbortError");
        }

        setCurrentSound(sound);
        await sound.playAsync();

        await new Promise((resolve, reject) => {
          const checkFinish = (status) => {
            if (status.didJustFinish) {
              sound.unloadAsync();
              resolve();
            }
          };

          const abortHandler = () => {
            sound.stopAsync();
            sound.unloadAsync();
            reject(new Error("AbortError"));
          };

          sound.setOnPlaybackStatusUpdate(checkFinish);
          abortControllerRef.current?.signal.addEventListener(
            "abort",
            abortHandler
          );

          // Cleanup function
          return () => {
            sound.setOnPlaybackStatusUpdate(null);
            abortControllerRef.current?.signal.removeEventListener(
              "abort",
              abortHandler
            );
          };
        });
      }

      if (isComponentMountedRef.current) {
        setCurrentSound(null);
        console.log("✅ 전체 오디오 재생 완료");
        stopPlaying();
      }
    } catch (error) {
      if (error.message === "AbortError") {
        console.log("재생이 취소되었습니다.");
      } else {
        console.error("오디오 파일 재생 실패:", error);
      }
      throw error;
    }
  };

  const handleStartReading = async () => {
    if (!isComponentMountedRef.current) return;

    setIsLoading(true);
    setIsRequesting(true);
    currentPathRef.current = pathname;

    try {
      // 새로운 AbortController 생성
      abortControllerRef.current = new AbortController();

      const reportIdsToRead = isSelectMode
        ? reports
            .filter((item) => selectedReports.includes(item.reportId))
            .map((item) => item.reportId)
        : reports.map((item) => item.reportId);

      const audioUrls = await createTTSReport(
        reportIdsToRead,
        abortControllerRef.current.signal
      );

      // 요청이 취소되었거나 컴포넌트가 언마운트되었으면 재생하지 않음
      if (!isComponentMountedRef.current) {
        console.log("컴포넌트가 언마운트되어 재생을 시작하지 않습니다.");
        return;
      }

      if (currentPathRef.current !== pathname) {
        console.log("경로가 변경되어 재생을 시작하지 않습니다.");
        return;
      }

      await stopPlaying();
      startPlaying();
      setAudioStorePlayAll(!isSelectMode || selectedReports.length === 0);

      await playAudioFiles(audioUrls);
    } catch (error) {
      if (error.name === "AbortError" || error.message === "AbortError") {
        console.log("재생이 취소되었습니다.");
      } else {
        console.error("음성 파일 링크 생성 실패:", error);
        setToastMessage("재생 중 오류가 발생했습니다.");
        setShowToast(true);
      }
    } finally {
      if (isComponentMountedRef.current) {
        setIsLoading(false);
        setIsRequesting(false);
        stopPlaying();
      }
    }
  };

  const handleStopReading = async () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsRequesting(false);
    stopPlaying();
    clearSelection();
  };

  const handleProtectedAction = (action) => {
    if (isPlaying || isLoading || isRequesting) {
      if (tabPressCount === 0) {
        setTabPressCount(1);
        setToastMessage("다시 한 번 누르면 이동됩니다.");
        setShowToast(true);

        timeoutRef.current = setTimeout(() => {
          setTabPressCount(0);
          setShowToast(false);
        }, 1000);
      } else {
        clearTimeout(timeoutRef.current);
        setTabPressCount(0);
        handleStopReading();
        setShowToast(false);

        setTimeout(() => {
          action();
        }, 0);
      }
      return;
    }
    action();
  };

  if (!reports) return null;

  return (
    <View style={styles.container}>
      <HeaderForDetail
        title={reports.title}
        onBack={() => handleProtectedAction(() => router.back())}
      />
      <ScrollView style={styles.scrollView}>
        <View style={styles.contentContainer}>
          <View style={styles.buttonContainer}>
            {isPlaying ? (
              <AnalysisButton
                SvgIcon={StopIcon}
                onPress={handleStopReading}
                iconSize={100}
              />
            ) : (
              <>
                <AnalysisButton
                  SvgIcon={isRequesting ? "" : PlayIcon}
                  onPress={handleStartReading}
                  iconSize={40}
                  disabled={isLoading}
                  text={isRequesting ? "준비 중..." : ""}
                  textStyle={{ color: "#69baff" }}
                  style={{ minWidth: 100 }}
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
          <View style={styles.border} />
          <View style={styles.content}>
            {reports
              .slice()
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
                  alwaysOpen={item.reportType === "REPORT_MONTHLY"}
                  isSelectMode={isSelectMode}
                  isSelected={
                    playAll || selectedReports.includes(item.reportId)
                  }
                  onToggleSelect={(isSelectedNow) => {
                    if (isPlaying) return;
                    toggleReportSelection(item.reportId);
                  }}
                />
              ))}
          </View>
        </View>
      </ScrollView>
      {showToast && (
        <BriefingToast
          message={toastMessage}
          onHide={() => setShowToast(false)}
        />
      )}
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
  top: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  backButton: {
    padding: 8,
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 8,
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: 16,
  },
  border: {
    height: 1,
    backgroundColor: "#E5E7EB",
  },
  content: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
  },
});
