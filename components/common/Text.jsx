import React from "react";
import { Text as RNText, StyleSheet } from "react-native";

const Text = ({
  children,
  style,
  variant = "regular",
  size = 16,
  color = "#000",
  ...props
}) => {
  const getFontFamily = () => {
    switch (variant) {
      case "bold":
        return "Pretendard-Bold";
      case "medium":
        return "Pretendard-Medium";
      case "semiBold":
        return "Pretendard-SemiBold";
      default:
        return "Pretendard";
    }
  };

  return (
    <RNText
      style={[
        styles.text,
        {
          fontFamily: getFontFamily(),
          fontSize: size,
          color,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </RNText>
  );
};

const styles = StyleSheet.create({
  text: {
    includeFontPadding: false,
    textAlignVertical: "center",
  },
});

export default Text;
