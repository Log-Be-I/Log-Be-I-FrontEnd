import React from "react";
import { View, StyleSheet } from "react-native";
import Text from "../../../components/common/Text";

export default function RecordScreen() {
  return (
    <View style={styles.container}>
      <Text variant="bold" size={24} color="#333">
        기록
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
});
