import { Slot } from "expo-router";
import { StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import Footer from "../../components/common/Footer";
import { SafeAreaView } from "react-native-safe-area-context";
import useAudioStore from "../../zustand/stores/useAudioStore";
import BriefingToast from "../../components/analysis/BriefingToast";
import { useState, useRef } from "react";

export default function AnalysisLayout() {
  const router = useRouter();
  const { isPlaying, stopPlaying } = useAudioStore();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [tabPressCount, setTabPressCount] = useState(0);
  const timeoutRef = useRef(null);

  const handleProtectedAction = (action) => {
    if (isPlaying) {
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
        stopPlaying();
        setShowToast(false);
        action();
      }
      return;
    }
    action();
  };

  const handleTabPress = (tab) => {
    handleProtectedAction(() => {
      switch (tab) {
        case "index":
          router.push("/(tabs)");
          break;
        case "record":
          router.push("/record");
          break;
        case "calendar":
          router.push("/calendar");
          break;
        case "settings":
          router.push("/settings");
          break;
        default:
          console.log("Invalid tab");
          break;
      }
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.content}>
        <Slot />
      </View>
      <Footer onTabPress={handleTabPress} />
      {showToast && (
        <BriefingToast
          message={toastMessage}
          onHide={() => setShowToast(false)}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});
