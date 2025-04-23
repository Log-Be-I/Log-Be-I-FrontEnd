import { View, StyleSheet, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";
import ProfileIcon from "../../assets/sidebar/sidebarProfile/aegiRogiProfile.svg";
import MyProfile from "../../assets/sidebar/sidebarProfile/myProfile.svg";
import { useTestUser } from "../../zustand/stores/testUser";
import useAuthStore from "../../zustand/stores/authStore";
import { useEffect } from "react";

export default function SidebarProfile() {
  const user = useAuthStore((state) => state.user);
  const router = useRouter();

  useEffect(() => {
    useTestUser();
  }, []);

  const handleProfilePress = () => {
    router.push("/profile/profileMain");
  };

  return (
    <View style={styles.profileContainer}>
      <View style={styles.profileCardOuter}>
        <View style={styles.profileCardBorder}>
          <View style={styles.profileCardInner}>
            <View style={styles.profileOuterCircle}>
              <View style={styles.profileInnerCircle}>
                <ProfileIcon width={40} height={40} />
              </View>
            </View>

            <View style={styles.profileInfo}>
              <View style={styles.usernameRow}>
                <Text style={styles.username}>{user.nickname}</Text>
              </View>
            </View>

            <Pressable
              onPress={handleProfilePress}
              style={styles.pencilButtonContainer}
            >
              <MyProfile width={16} height={16} />
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  profileContainer: {
    width: "100%",
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  profileCardOuter: {
    borderRadius: 16,
    padding: 1.5,
    backgroundColor: "#A4C6FF",
  },
  profileCardBorder: {
    borderRadius: 15,
    padding: 1.5,
    backgroundColor: "#FFFFFF",
  },
  profileCardInner: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 14,
    backgroundColor: "#ffffff",
  },
  profileOuterCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#A4C6FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  profileInnerCircle: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  profileInfo: {
    flex: 1,
  },
  usernameRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  username: {
    fontSize: 18,
    fontWeight: "600",
    color: "#032B77",
    marginRight: 8,
  },
  pencilButtonContainer: {
    position: "absolute",
    top: 16,
    right: 16,
    padding: 4,
    zIndex: 1,
  },
});
