import { Pressable, Text, StyleSheet, View } from 'react-native';

export default function SaveButton({ onPress, children }) {
  return (
    <View style={styles.shadowWrapper}>
      <Pressable onPress={onPress} style={styles.button}>
        {children}
        {/*<Text style={styles.buttonText}>Register</Text>*/}
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
  button: {
    backgroundColor: '#61B9FF',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 9999,
    alignItems: 'center',
    minWidth: 100,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'regular',
    fontSize: 16,
  },
});
