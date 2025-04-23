import { Pressable, Text, StyleSheet, View } from 'react-native';

export default function SaveButton({ onPress, children, style, disabled}) {
  return (
    <View style={[
      styles.shadowWrapper, 
      disabled ? styles.shadowWrapperDisabled : null,
      style]}>
      <Pressable 
      onPress={onPress} 
      style={[styles.button, disabled && styles.disabledButton]}>
        {children}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
    shadowWrapper: {
    backgroundColor: '#61B9FF',
    borderRadius: 9999,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10, // Android용 그림자
  },
  shadowWrapperDisabled: {
    backgroundColor: '#E5E7EB',
    shadowColor: 'transparent', // 그림자 제거
    elevation: 0,
  },
  button: {
    backgroundColor: '#61B9FF',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 9999,
    alignItems: 'center',
    minWidth: 80,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'regular',
    fontSize: 16,
  },
  disabledButton: {
    backgroundColor: '#E5E7EB',
  },
});
