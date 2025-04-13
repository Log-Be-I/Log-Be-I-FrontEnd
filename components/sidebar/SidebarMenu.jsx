import { View, StyleSheet, Pressable } from "react-native";
import Text from "../common/Text";
import HomeIcon from "../../assets/sidebar/sidebarMenu/home.svg";
import CalendarIcon from "../../assets/sidebar/sidebarMenu/calendar.svg";
import ChatIcon from "../../assets/sidebar/sidebarMenu/chat.svg";
import SettingIcon from "../../assets/sidebar/sidebarMenu/setting.svg";
import LogoutIcon from "../../assets/sidebar/sidebarMenu/logout.svg";

export default function SidebarMenu() {
  return (
    <View style={styles.menuContainer}>
      <Pressable style={styles.menuItem}>
        <HomeIcon width={24} height={24} />
        <Text variant="medium" size={16} color="#333">
          홈
        </Text>
      </Pressable>
      <Pressable style={styles.menuItem}>
        <CalendarIcon width={24} height={24} />
        <Text variant="medium" size={16} color="#333">
          캘린더
        </Text>
      </Pressable>
      <Pressable style={styles.menuItem}>
        <ChatIcon width={24} height={24} />
        <Text variant="medium" size={16} color="#333">
          채팅
        </Text>
      </Pressable>
      <Pressable style={styles.menuItem}>
        <SettingIcon width={24} height={24} />
        <Text variant="medium" size={16} color="#333">
          설정
        </Text>
      </Pressable>
      <Pressable style={styles.menuItem}>
        <LogoutIcon width={24} height={24} />
        <Text variant="medium" size={16} color="#333">
          로그아웃
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  menuContainer: {
    width: "100%",
    paddingHorizontal: 16,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  menuText: {
    marginLeft: 12,
  },
});
