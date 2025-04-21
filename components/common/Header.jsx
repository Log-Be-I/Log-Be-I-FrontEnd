import { useState } from "react";
import { View, Pressable, StyleSheet } from "react-native";
import LogBeIText from "../../assets/images/logBeIText.svg"; // 로고 SVG
import MenuIcon from "../../assets/images/menuIconHeader.svg"; // 메뉴 SVG
import SidebarSlideOverlay from "../sidebar/SidebarSlideOverlay";

export default function Header() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const openSidebar = () => {
    setIsSidebarOpen(true);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <View style={styles.headerContainer}>
      <View style={styles.logoContainer}>
        <LogBeIText width={88} height={45} />
      </View>

      {/* 오른쪽 메뉴 아이콘 (누르면 onMenuPress 실행) */}
      <Pressable onPress={openSidebar} style={styles.menuIconContainer}>
        <MenuIcon width={26} height={21} />
      </Pressable>

      <SidebarSlideOverlay visible={isSidebarOpen} onClose={closeSidebar} />
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    width: "100%",
    paddingHorizontal: 20,
    paddingVertical: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#F0F4FA",
  },
  logoContainer: {
    flex: 1,
    alignItems: "center",
  },
  menuIconContainer: {
    position: "absolute",
    right: 20,
    zIndex: 2,
  },
});
