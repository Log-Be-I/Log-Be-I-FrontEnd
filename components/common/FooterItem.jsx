// components/common/FooterItem.jsx

import { View, Pressable, StyleSheet } from "react-native";
import HomeIcon from "../../assets/footerIcon/homeIcon.svg";
import DailyIcon from "../../assets/footerIcon/dailyIcon.svg";
import RecordIcon from "../../assets/footerIcon/recordIcon.svg";
import CalendarIcon from "../../assets/footerIcon/calendarIcon.svg";
import SettingsIcon from "../../assets/footerIcon/settingsIcon.svg";

export default function FooterItem({ name, active, onPress, isCenter }) {
  // 이름에 따라 SVG 아이콘 선택
  const IconComponent = {
    index: HomeIcon,
    record: DailyIcon,
    center: RecordIcon, // 중앙 구슬 아이콘
    calendar: CalendarIcon,
    settings: SettingsIcon,
  }[name];

  // 중앙 구슬 아이콘만 크게 표시
  const iconSize = name === "center" ? 70 : 24;

  return (
    <View style={styles.wrapper}>
      {/* 현재 선택된 탭이면 마름모 포인터 표시 */}
      {active && !isCenter && (
        <View style={styles.activeIndicator}>
          <View style={styles.pointer} />
        </View>
      )}

      {/* 전체 아이콘 영역을 누르면 onPress 실행 */}
      <Pressable
        onPress={onPress}
        style={[styles.iconArea, isCenter && styles.centerIconArea]}
      >
        <IconComponent width={iconSize} height={iconSize} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "center",
    position: "relative",
  },
  iconArea: {
    padding: 10, // 터치 영역 확대
    borderRadius: 50,
    backgroundColor: "transparent",
  },
  centerIconArea: {
    backgroundColor: "#00CFFF", // 가운데 강조
    width: 56,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 28,
    marginTop: -78,
  },
  activeIndicator: {
    position: "absolute",
    top: -10,
    alignItems: "center",
    width: "100%",
    overflow: "hidden",
  },
  pointer: {
    width: 14,
    height: 14,
    backgroundColor: "white",
    transform: [{ rotate: "45deg" }],
    borderRadius: 3,
    top: -6,
  },
});

/**
 * FooterItem
 * @param {string} name - 탭 이름
 * @param {boolean} active - 현재 탭인지 여부
 * @param {function} onPress - 탭 누를 시 실행 함수
 * @param {boolean} isCenter - 가운데 강조 아이콘인지
 */

// svg는 이미지 아이콘만 보여준다.
// Pressable은 사용자가 누르는 해동을 담당한다.
// FooterItem은 구역 기준 터치했을 때 한 아이콘을 담당한다.
// Footer는 전체 바 레이아웃을 담당한다.
