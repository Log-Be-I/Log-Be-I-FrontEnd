import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Footer from "../../components/common/Footer";
import Header from "../../components/common/Header";
import { Slot, useRouter, usePathname } from "expo-router";
import SidebarSlideOverlay from "../../components/sidebar/SidebarSlideOverlay";

export default function TabLayout() {
  const [currentTab, setCurrentTab] = useState("index");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const path = pathname.split("/")[1] || "index";
    setCurrentTab(path);
  }, [pathname]);

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

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.mainContent}>
          <Header onMenuPress={() => setIsSidebarOpen(true)} />
          <View style={styles.content}>
            <Slot />
          </View>
          <Footer currentTab={currentTab} onTabPress={handleTabPress} />
        </View>
      </SafeAreaView>
      <SidebarSlideOverlay
        visible={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
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
  mainContent: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});
