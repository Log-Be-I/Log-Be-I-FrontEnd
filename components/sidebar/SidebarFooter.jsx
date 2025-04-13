import { View, StyleSheet, Pressable } from "react-native";
import Text from "../common/Text";

export default function SidebarFooter() {
  return (
    <View style={styles.footerContainer}>
      <Pressable style={styles.footerItem}>
        <Text variant="medium" size={14} color="#666">
          이용약관
        </Text>
      </Pressable>
      <Pressable style={styles.footerItem}>
        <Text variant="medium" size={14} color="#666">
          개인정보처리방침
        </Text>
      </Pressable>
      <Pressable style={styles.footerItem}>
        <Text variant="medium" size={14} color="#666">
          고객센터
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  footerContainer: {
    width: "100%",
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  footerItem: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
});
