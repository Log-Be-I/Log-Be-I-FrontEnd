import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import NoticeButton from './NoticeButton';

export default function NoticeItem({ title, createdAt, importance, onPress }) {
  return (
    <Pressable 
      style={[
        styles.container,
        importance && styles.importantContainer
      ]}
      onPress={onPress}
    >
      <View style={styles.content}>
        <NoticeButton importance={importance} />
        <View style={styles.textContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.date}>{createdAt}</Text>
        </View>
      </View>
      <View style={[
        styles.border,
        importance ? styles.importantBorder : styles.normalBorder
      ]} />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  importantContainer: {
    backgroundColor: 'rgba(105, 186, 255, 0.2)',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textContainer: {
    marginLeft: 12,
    flex: 1,
  },
  title: {
    fontSize: 16,
    color: '#000000',
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
    color: '#666666',
  },
  border: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  importantBorder: {
    height: 2,
    backgroundColor: '#69BAFF',
  },
  normalBorder: {
    height: 1,
    backgroundColor: '#69BAFF',
  },
});