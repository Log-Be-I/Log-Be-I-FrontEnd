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
    <>
      <View style={styles.headerContainer}>
        <View style={styles.logoContainer}>
          <LogBeIText width={88} height={45} />
        </View>

        {/* 오른쪽 메뉴 아이콘 (누르면 onMenuPress 실행) */}
        <Pressable onPress={openSidebar} style={styles.menuIconContainer}>
          <MenuIcon width={26} height={21} />
        </Pressable>
      </View>

      <SidebarSlideOverlay visible={isSidebarOpen} onClose={closeSidebar} />
    </>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    width: "100%",
    paddingHorizontal: 20, // 좌우 여백
    paddingTop: 60, // 위 여백
    //paddingBottom: 6, // 아래 여백
    flexDirection: "row", // 가로로 정렬
    justifyContent: "space-between", // 좌/우 끝으로 정렬
    alignItems: "center", // 세로 중앙 정렬
  },
  logoContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
  },
  menuIconContainer: {
    position: "absolute",
    right: 20,
  },
});
