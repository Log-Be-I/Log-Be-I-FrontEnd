import { View, Pressable, StyleSheet } from "react-native";
import MenuIcon from "../../assets/images/menuIconHeader.svg";
import LogBeIText from "../../assets/images/logBeIText.svg";

export default function HeaderForDetail({ handleProtectedAction, setModalVisible }) {
  return (
    <View style={styles.headerContainer}>
      <View style={styles.logoContainer}>
        <LogBeIText width={88} height={45} />
      </View>
      <Pressable
        onPress={() => handleProtectedAction(() => {
          setModalVisible(true);
        })}
        style={styles.menuIconContainer}
      >
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
