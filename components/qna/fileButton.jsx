import { Pressable, StyleSheet, View } from 'react-native';

export default function OutlinedIconButton({ onPress, children }) {
  return (
    <View style={styles.wrapper}>
      <Pressable onPress={onPress} style={styles.button}>
        {children}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    //alignItems: 'flex-end',
    width: 60,
    height: 90,
    marginTop: 16,
  },
  button: {
    backgroundColor: '#fff',
    borderColor: '#E5E7EB',
    borderWidth: 1,
    borderRadius: 9999,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
});
