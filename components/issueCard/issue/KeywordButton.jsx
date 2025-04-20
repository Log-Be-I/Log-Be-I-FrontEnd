import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const KeywordButton = ({ keyword, onPress, style }) => {
  return (
    <Pressable style={[styles.container, style]} onPress={onPress}>
      <Text style={styles.text}>{keyword}</Text>
      <Icon name="chevron-down" size={20} color="#000" style={styles.icon} />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#69BAFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  icon: {
    marginLeft: 8,
  },
});

export default KeywordButton; 