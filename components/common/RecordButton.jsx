import { Pressable, Text, StyleSheet } from "react-native";

export default function RecordButton({
  label,
  onPress,
  variant = "default",
  size = "medium",
  disabled = false,
}) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        styles[variant],
        styles[size],
        disabled && styles.disabled,
        pressed && styles.pressed,
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text
        style={[
          styles.text,
          styles[`${variant}Text`],
          styles[`${size}Text`],
          disabled && styles.disabledText,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E5E5",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 2,
  },
  default: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E5E5E5",
  },
  primary: {
    backgroundColor: "#69BAFF",
    borderWidth: 0,
  },
  danger: {
    backgroundColor: "#FF5656",
    borderWidth: 0,
  },
  small: {
    height: 24,
    paddingHorizontal: 10,
  },
  medium: {
    height: 28,
    paddingHorizontal: 14,
  },
  large: {
    height: 32,
    paddingHorizontal: 16,
  },
  disabled: {
    backgroundColor: "#F5F5F5",
    borderColor: "#E5E5E5",
  },
  pressed: {
    opacity: 0.8,
  },
  text: {
    fontWeight: "500",
  },
  defaultText: {
    color: "#666666",
  },
  primaryText: {
    color: "#FFFFFF",
  },
  dangerText: {
    color: "#FFFFFF",
  },
  smallText: {
    fontSize: 11,
  },
  mediumText: {
    fontSize: 13,
  },
  largeText: {
    fontSize: 14,
  },
  disabledText: {
    color: "#999999",
  },
});
