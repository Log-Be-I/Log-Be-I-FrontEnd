import { View, StyleSheet } from "react-native";
import Text from "../common/Text";

export default function SidebarHeader() {
  return (
    <View style={styles.headerContainer}>
      <Text variant="bold" size={24} color="#333">
        Log-Be-I
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    width: "100%",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },
});
