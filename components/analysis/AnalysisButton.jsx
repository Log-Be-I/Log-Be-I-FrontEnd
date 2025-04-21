// components/common/CalendarButton.jsx
import { Pressable, StyleSheet, View } from "react-native";
import Text from "../common/Text";

export default function AnalysisButton({
    text,
    onPress,
    textStyle,
    disabled,
    SvgIcon,
    iconSize = 16,
  }) {
    const onlyIcon = SvgIcon && !text;
  
    return (
      <Pressable
        style={[styles.buttonOuter, disabled && styles.disabledButton]}
        onPress={onPress}
        disabled={disabled}
      >
        <View style={styles.buttonInner}>
          <View style={[styles.contentContainer, onlyIcon ? styles.centerOnlyIcon : styles.contentRow]}>
            {SvgIcon && (
              <SvgIcon
                width={iconSize}
                height={iconSize}
                style={styles.iconStyle}
              />
            )}
            {text && (
              <Text variant="semiBold" size={12} style={textStyle}>
                {text}
              </Text>
            )}
          </View>
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
    disabledButton: {
      borderRadius: 50,
      backgroundColor: "#f0f4ff",
    },
    buttonInner: {
      backgroundColor: "#fff",
      borderRadius: 50,
      borderWidth: 1,
      borderColor: "#E0E9FF",
      alignItems: "center",
      justifyContent: "center",
      width: 80,
      height: 35,
    },
    contentContainer: {
      flex: 1,
    },
    contentRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
    },
    centerOnlyIcon: {
      justifyContent: "center",
      alignItems: "center",
    },
    iconStyle: {
      marginRight: 6,
    },
  });