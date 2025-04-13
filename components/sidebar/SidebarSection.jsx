import { View, StyleSheet, Pressable } from "react-native";
import Text from "../common/Text";

export default function SidebarSection({ title, items }) {
  return (
    <View style={styles.section}>
      <Text variant="semiBold" size={16} color="#1170DF">
        {title}
      </Text>
      <View style={styles.content}>
        {items.map((item, index) => (
          <Pressable
            key={index}
            style={[styles.item, index === items.length - 1 && styles.lastItem]}
            onPress={() => {
              /* 각 항목 클릭 처리 */
            }}
          >
            <Text variant="regular" size={16}>
              {item.icon}
            </Text>
            <Text variant="regular" size={16} style={styles.label}>
              {item.label}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 16,
  },
  content: {
    backgroundColor: "#F5F9FF",
    borderRadius: 12,
    overflow: "hidden",
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },
  lastItem: {
    borderBottomWidth: 0,
  },
  label: {
    marginLeft: 8,
  },
});
