import React, { useState, useRef, useEffect } from "react";
import { Platform, View, StyleSheet, Modal, Animated } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Footer from "../../components/common/Footer";
import Header from "../../components/common/Header";
import Sidebar from "../../components/sidebar/Sidebar";
import { Slot, useRouter } from "expo-router";

export default function TabLayout() {
  const [currentTab, setCurrentTab] = useState("index");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const slideAnim = useRef(new Animated.Value(-100)).current;
  const router = useRouter();

  const handleTabPress = (tabName) => {
    setCurrentTab(tabName);
    switch (tabName) {
      case "index":
        router.push("/");
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
    }
  };

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: isSidebarOpen ? 0 : -100,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isSidebarOpen]);

  return (
    <View style={styles.container}>
      {isSidebarOpen && (
        <Animated.View
          style={[
            styles.sidebarContainer,
            {
              transform: [
                {
                  translateX: slideAnim.interpolate({
                    inputRange: [-100, 0],
                    outputRange: ["-100%", "0%"],
                  }),
                },
              ],
            },
          ]}
        >
          <Sidebar onClose={() => setIsSidebarOpen(false)} />
        </Animated.View>
      )}

      <SafeAreaView style={styles.safeArea}>
        <Header />
        <View style={styles.content}>
          <Slot />
        </View>
        <Footer currentTab={currentTab} onTabPress={handleTabPress} />
      </SafeAreaView>
    </View>
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
  sidebarContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    width: "100%",
    zIndex: 1000,
  },
});
