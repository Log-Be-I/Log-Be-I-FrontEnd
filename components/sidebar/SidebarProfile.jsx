// components/sidebar/SidebarProfile.jsx
import { View, StyleSheet, Image } from "react-native";
import Text from "../common/Text";
//import ProfileIcon from '../../assets/sidebar/sidebarProfile/aegilogiSidebar.svg';
import EmailIcon from "../../assets/sidebar/sidebarProfile/caseIcon.svg";
import pencilIcon from "../../assets/sidebar/sidebarProfile/pencil.svg";

export default function SidebarProfile() {
  return (
    <View style={styles.profileContainer}>
      <View style={styles.profileCard}>
        <View style={styles.profileBorderCircle}>
          <View style={styles.profileInnerCircle}></View>
        </View>
        <View style={styles.profileInfo}>
          <Text variant="semiBold" size={18}>
            aegiRogi
          </Text>
          <View style={styles.emailContainer}>
            <EmailIcon width={16} height={16} />
            <Text variant="regular" size={14} color="#666" style={styles.email}>
              aegirogi@gmail.com
            </Text>
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
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#F5F9FF",
    borderWidth: 1.5,
    borderColor: "#A4C6FF",
    width: "100%",
  },
  profileBorderCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#A4C6FF", // 바깥 원 색상 (하늘색)
    justifyContent: "center",
    alignItems: "center",
  },
  profileInnerCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#fff", // 안쪽 원 색상 (흰색)
  },
  profileInfo: {
    marginLeft: 16,
  },
  emailContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  email: {
    marginLeft: 4,
  },
});
