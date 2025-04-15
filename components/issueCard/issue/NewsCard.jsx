import React from 'react';
import { Pressable, StyleSheet, Text, View, ScrollView } from 'react-native';

const NewsCard = ({ title, content, onPress }) => {
  return (
    <View style={styles.container}>
      <View style={styles.dot} />
      <Pressable style={styles.card} onPress={onPress}>
        <ScrollView style={styles.scrollContainer}>
          <Text style={styles.title} numberOfLines={2}>{title}</Text>
          <Text style={styles.content}>{content}</Text>
        </ScrollView>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    marginHorizontal: 20,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#3650FA',
    position: 'absolute',
    top: -4,
    left: 10,
    zIndex: 1,
  },
  card: {
    height: 160,
    backgroundColor: '#fff',
    borderTopWidth: 2,
    borderTopColor: '#69BAFF',
    marginTop: 4,
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderTopColor: '#69BAFF',
    borderBottomColor: '#3650FA',
  },
  scrollContainer: {
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
    lineHeight: 26,
    color: '#1E3A8A',
  },
  content: {
    fontSize: 14,
    color: '#032B77',
    lineHeight: 20,
  },
});

export default NewsCard; 