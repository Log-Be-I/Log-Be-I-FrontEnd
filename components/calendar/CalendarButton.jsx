// components/common/CalendarButton.jsx
import { Pressable, StyleSheet, View } from "react-native";
import Text from "../common/Text";

export default function CalendarButton({
  text,
  onPress,
  disabled,
  type = "primary",
}) {
  return (
    <Pressable
      style={[
        styles.buttonBase,
        typeStyles[type],
        disabled && styles.disabledButton,
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={[styles.buttonText, textStyles[type]]}>{text}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  buttonBase: {
    borderRadius: 15,
    width: 120,
    height: 45,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 5,
    marginTop: 50,
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    lineHeight: 18,
  },
});

const typeStyles = {
  cancel: { backgroundColor: "#F0F0F0" },
  edit: { backgroundColor: "#72B8FF" },
  delete: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#FF9500",
  },
  ok: { backgroundColor: "#72B8FF" },
  primary: { backgroundColor: "#72B8FF" },
};

const textStyles = {
  cancel: { color: "#666666", fontWeight: "bold" },
  edit: { color: "#FFFFFF", fontWeight: "bold" },
  delete: { color: "#FF9500", fontWeight: "bold" },
  ok: { color: "#FFFFFF", fontWeight: "bold" },
  primary: { color: "#FFFFFF", fontWeight: "bold" },
};
