// components/sidebar/Sidebar.jsx
import { View, StyleSheet, Text, Pressable, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import SidebarHeader from "./SidebarHeader";
import SidebarProfile from "./SidebarProfile";
import SidebarNavMenu from "./SidebarNavMenu";
import SidebarSection from "./SidebarSection";
import LogoutIcon from "../../assets/sidebar/logoutIcon.svg";
import useAuthStore from "../../zustand/stores/authStore";

export default function Sidebar({ onClose }) {
  const router = useRouter();
  const { logout } = useAuthStore();

  const handleLogout = async () => {
    try {
      await logout();
      router.replace("/");
    } catch (error) {
      console.error("로그아웃 에러:", error);
    }
  };

  return (
    <View style={styles.container}>
      {/* 상단 영역 (upper) */}
      <View style={styles.upperContainer}>
        <SidebarHeader onClose={onClose} />
        <SidebarProfile />
      </View>

      {/* 하단 영역 (lower) */}
      <View style={styles.lowerContainer}>
        {/* 왼쪽 네비게이션 메뉴 */}
        <View style={styles.sideNavMenu}>
          <SidebarNavMenu />
        </View>

        {/* 오른쪽 콘텐츠 영역 */}
        <View style={styles.contentArea}>
          {/* Sections */}
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.sectionsContainer}
            showsVerticalScrollIndicator={false}
          >
            <SidebarSection
              title="My Record"
              items={[
                { id: "daily", label: "나의 일상", icon: "📔" },
                { id: "spending", label: "나의 소비", icon: "💰" },
                { id: "todo", label: "나의 할 일", icon: "📝" },
                { id: "health", label: "나의 건강", icon: "🩺" },
                { id: "etc", label: "그 외 등등", icon: "📦" },
              ]}
            />

            <SidebarSection
              title="My Report"
              items={[{ id: "analysis", label: "나의 일상 분석", icon: "📊" }]}
            />

            <SidebarSection
              title="My Activity"
              items={[
                { id: "issue", label: "오늘의 이슈", icon: "🔍" },
                { id: "qna", label: "나의 QnA", icon: "💭" },
                { id: "faq", label: "자주 하는 질문", icon: "❓" },
              ]}
            />
          </ScrollView>

          {/* Logout */}
          <View style={styles.logoutContainer}>
            <View style={styles.logoutDivider} />
            <Pressable style={styles.logoutButton} onPress={handleLogout}>
              <LogoutIcon width={20} height={20} />
              <Text style={styles.logoutText}>Log Out</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%",
    backgroundColor: "#fff",
    display: "flex",
    flexDirection: "column",
  },
  // 상단 영역
  upperContainer: {
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },
  // 하단 영역
  lowerContainer: {
    flex: 1,
    flexDirection: "row", // 좌우 배치
    minHeight: 0, // 스크롤이 가능하도록
  },
  // 왼쪽 네비게이션 메뉴
  sideNavMenu: {
    width: 60, // 파란색 사이드바 너비
    backgroundColor: "#69BAFF",
    alignItems: "center",
    paddingVertical: 20,
  },
  // 오른쪽 콘텐츠 영역
  contentArea: {
    flex: 1,
    backgroundColor: "#fff",
    flexDirection: "column",
    display: "flex",
  },
  scrollView: {
    flex: 1,
  },
  // 섹션들을 포함하는 컨테이너
  sectionsContainer: {
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  // 로그아웃 영역
  logoutContainer: {
    padding: 16,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "rgba(105, 186, 255, 0.2)",
  },
  logoutDivider: {
    display: "none", // divider 대신 border 사용
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
  },
  logoutText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#666",
  },
});
