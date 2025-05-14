import { View, Pressable, StyleSheet } from "react-native";
import LogBeIText from "../../assets/images/logBeIText.svg"; // 로고 SVG
import MenuIcon from "../../assets/images/menuIconHeader.svg"; // 메뉴 SVG

export default function Header({ onMenuPress }) {
  return (
    <View style={styles.headerContainer}>
      <View style={styles.logoContainer}>
        <LogBeIText width={88} height={45} />
      </View>

      {/* 오른쪽 메뉴 아이콘 (누르면 onMenuPress 실행) */}
      <Pressable onPress={onMenuPress} style={styles.menuIconContainer}>
        <MenuIcon width={26} height={21} />
      </Pressable>
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
