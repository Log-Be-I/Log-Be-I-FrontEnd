import { View, StyleSheet, Text, Pressable, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SidebarHeader from "./SidebarHeader";
import SidebarProfile from "./SidebarProfile";
import SidebarNavMenu from "./SidebarNavMenu";
import SidebarSection from "./SidebarSection";
import LogoutIcon from "../../assets/sidebar/logoutIcon.svg";
import { useMemberStore } from "../../zustand/stores/member";
import { CATEGORIES } from "../../constants/CategoryData";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { SafeAreaView } from "react-native-safe-area-context";
import useAuthStore from "../../zustand/stores/useAuthStore";

export default function Sidebar({ onClose }) {
  const router = useRouter();
  const { clearMember } = useMemberStore();

  const handleLogout = async () => {
    try {
      // 먼저 라우팅
      router.replace("/(onBoard)");

      // 그 다음 상태 초기화
      clearMember();
      useAuthStore.getState().clearToken();
      await AsyncStorage.clear();
    } catch (error) {
      console.error("로그아웃 에러:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <View style={styles.upperContainer}>
          <SidebarHeader onClose={onClose} />
          <SidebarProfile />
        </View>

        <View style={styles.lowerContainer}>
          <View style={styles.sideNavMenu}>
            <SidebarNavMenu />
          </View>

          <View style={styles.contentArea}>
            <ScrollView
              style={styles.scrollView}
              contentContainerStyle={styles.sectionsContainer}
              showsVerticalScrollIndicator={false}
            >
              <SidebarSection
                title="My Record"
                items={CATEGORIES.map((cat) => ({
                  id: `category-${cat.categoryId}`,
                  label: `나의 ${cat.name}`,
                  iconComponent: (
                    <Icon name={cat.icon} size={20} color={cat.color} />
                  ),
                  route: `/record?category=${cat.categoryId}`,
                }))}
                onItemPress={(route) => {
                  router.push({
                    pathname: "/record",
                    params: { category: route.split("=")[1] },
                  });
                  onClose();
                }}
              />

              <SidebarSection
                title="My Report"
                items={[
                  {
                    id: "analysis",
                    label: "나의 일상 분석",
                    icon: "📊",
                    route: "/analysis",
                  },
                ]}
                onItemPress={(route) => router.push(route)}
              />

              <SidebarSection
                title="My Activity"
                items={[
                  {
                    id: "issue",
                    label: "오늘의 이슈",
                    icon: "🔍",
                    route: "/issueCard/loading",
                  },
                  { id: "qna", label: "나의 QnA", icon: "💭", route: "/qna" },
                  {
                    id: "faq",
                    label: "자주 하는 질문",
                    icon: "❓",
                    route: "/faq",
                  },
                ]}
                onItemPress={(route) => router.push(route)}
              />

              <View style={styles.logoutContainer}>
                <View style={styles.logoutDivider} />
                <Pressable style={styles.logoutButton} onPress={handleLogout}>
                  <LogoutIcon width={20} height={20} />
                  <Text style={styles.logoutText}>Log Out</Text>
                </Pressable>
              </View>
            </ScrollView>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    zIndex: 1000,
    height: "100%",
    backgroundColor: "#fff",
    display: "flex",
    flexDirection: "column",
  },
  upperContainer: {
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },
  lowerContainer: {
    flex: 1,
    flexDirection: "row",
    minHeight: 0,
  },
  sideNavMenu: {
    width: 60,
    backgroundColor: "#69BAFF",
    alignItems: "center",
    paddingVertical: 20,
  },
  contentArea: {
    flex: 1,
    backgroundColor: "#fff",
    flexDirection: "column",
    display: "flex",
  },
  scrollView: {
    flexGrow: 1,
  },
  sectionsContainer: {
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  logoutContainer: {
    padding: 16,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "rgba(105, 186, 255, 0.2)",
  },
  logoutDivider: {
    display: "none",
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
