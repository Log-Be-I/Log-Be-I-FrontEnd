import React from 'react';
import { Pressable, StyleSheet, Text, View, ScrollView } from 'react-native';

const NewsCard = ({ title, content, pubDate, onPress }) => {
  return (
    <View style={styles.container}>
      <Pressable style={styles.card} onPress={onPress}>
        <ScrollView style={styles.scrollContainer}>
          <Text style={styles.title} numberOfLines={2}>{title}</Text>
          <Text style={styles.content}>{content}</Text>
          <Text style={styles.pubDate}>{pubDate}</Text>
        </ScrollView>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 5,
    marginHorizontal: 20,
  },
  card: {
    height: 185,
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
  pubDate: {
    fontSize: 12,
    color: '#032B77',
    lineHeight: 16,
    marginTop: 8,
    textAlign: 'right',
    marginLeft: 16,
  },
});

export default NewsCard; 