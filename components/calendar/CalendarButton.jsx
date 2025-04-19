// components/common/CalendarButton.jsx
import { Pressable, StyleSheet, View } from "react-native";
import Text from "../common/Text";

export default function CalendarButton({ text, onPress, textStyle }) {
  return (
    <Pressable style={styles.buttonOuter} onPress={onPress}>
      <View style={styles.buttonInner}>
        <Text variant="semiBold" size={16} style={textStyle}>
          {text}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  buttonOuter: {
    alignSelf: "center",
    borderRadius: 50,
    padding: 2,
    backgroundColor: "#f0f4ff",
    shadowColor: "#B7BFFF",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
  },
  buttonInner: {
    backgroundColor: "#fff",
    borderRadius: 50,
    borderWidth: 1,
    borderColor: "#E0E9FF",
    alignItems: "center",
    justifyContent: "center",
    width: 100,
    height: 40,
  },
});
