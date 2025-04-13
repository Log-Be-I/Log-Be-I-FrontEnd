import { Image, TextInput, View, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

const TextComponent = ({
  iconComponent,
  iconName,
  value,
  handleValue,
  icon,
  placeholder,
  editable,
}) => {
  return (
    <View style={styles.inputWrapper}>
      {iconComponent ? (
        <View style={styles.icon}>{iconComponent}</View>
      ) : iconName ? (
        <Icon name={iconName} size={20} color="#999" style={styles.icon} />
      ) : null}
      <TextInput
        value={value}
        onChangeText={handleValue}
        placeholder={placeholder}
        placeholderTextColor="#aaa"
        style={styles.input}
        editable={editable}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: "#333",
    fontFamily: "Pretendard",
  },
});

export default TextComponent;
