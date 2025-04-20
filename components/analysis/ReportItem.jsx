import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export default function ReportItem({ title, content, onPress }) {
  return (
    <Pressable style={styles.container} onPress={onPress}>
      <View style={styles.iconContainer}>
        <Icon name="document-text-outline" size={24} color="#69BAFF" />
      </View>
      <View style={styles.separator} />
      <View style={styles.contentContainer}>
        <Text style={styles.title}>{title}</Text>
        {content && <Text style={styles.content}>{content}</Text>}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 15,
    marginVertical: 5,
    marginHorizontal: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    flexDirection: 'row',
    alignItems: 'flex-start',
    minHeight: 80,
  },
  iconContainer: {
    width: 40,
    alignItems: 'center',
  },
  separator: {
    width: 1,
    height: '100%',
    backgroundColor: '#69BAFF',
    marginHorizontal: 16,
  },
  contentContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    color: '#1F2937',
    marginBottom: 8,
  },
  content: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
  },
}); 