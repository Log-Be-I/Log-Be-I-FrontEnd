import { Pressable, StyleSheet, View } from "react-native";
import Text from "./Text";

export default function Button({ text, onPress, size = "medium", textStyle }) {
  return (
    <Pressable style={styles.buttonOuter} onPress={onPress}>
      <View style={[styles.buttonInner, sizeStyle[size]]}>
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
    backgroundColor: "#f0f4ff", // 바깥 테두리 느낌
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
  },
});

const sizeStyle = {
  small: {
    paddingVertical: 5,
    paddingHorizontal: 16,
  },
  medium: {
    paddingVertical: 6,
    paddingHorizontal: 24,
  },
  large: {
    paddingVertical: 8,
    paddingHorizontal: 32,
  },
};
