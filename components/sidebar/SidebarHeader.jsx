import React from "react";
import { View, Pressable, StyleSheet } from "react-native";
import LogBeIText from "../../assets/images/logBeIText.svg"; // 로고 SVG
import BackButton from "../../assets/sidebar/backIconSide.svg"; // 뒤로가기 SVG
import NotificationIcon from "../../assets/sidebar/notificationIconSide.svg"; // 알림 아이콘 SVG

export default function SidebarHeader({ onClose }) {
  return (
    <View style={styles.headerContainer}>
      <View style={styles.headerContent}>
        {/* 뒤로가기 버튼 - 클릭 시 사이드바 닫기 */}
        <Pressable onPress={onClose} style={styles.leftIcon}>
          <BackButton width={21} height={16} />
        </Pressable>

        {/* 로고 */}
        <View style={styles.logoContainer}>
          <LogBeIText width={100} height={24} />
        </View>

        {/* 알림 버튼 */}
        <Pressable style={styles.rightIcon}>
          <NotificationIcon width={20} height={20} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    width: "100%",
    backgroundColor: "#fff",
    paddingVertical: 12,
  },
  leftIcon: {
    width: 50,
    alignItems: "flex-start",
    padding: 8,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    padding: 4,
  },
  logoContainer: {
    marginLeft: 22,
    flex: 1,
  },
  notificationButton: {
    padding: 4,
  },
  rightIcon: {
    padding: 4,
  },
});
