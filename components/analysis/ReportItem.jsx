import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export default function ReportItem({ title, content, onPress }) {
  return (
    <Pressable style={styles.container} onPress={onPress}>
      <View style={styles.titleRow}>
          <Icon name="document-text-outline" size={24} color="#69BAFF" />
          <View style={styles.separator} />
          <Text style={styles.title}>{title}</Text>
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.content}>{content}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  // container: {
  //   backgroundColor: '#F9FAFB',
  //   padding: 15,
  //   marginVertical: 5,
  //   marginHorizontal: 10,
  //   borderRadius: 10,
  //   shadowColor: '#000',
  //   shadowOffset: {
  //     width: 0,
  //     height: 2,
  //   },
  //   shadowOpacity: 0.1,
  //   shadowRadius: 3,
  //   elevation: 3,
  //   flexDirection: 'row',
  //   alignItems: 'flex-start',
  //   minHeight: 80,
  // },
  container: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
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
    fontSize: 20,
    fontWeight: 'bold',
    color: '#5B75B1',
    marginBottom: 8,
  },
  content: {
    fontSize: 16,
    color: '#6C7A8A',
    lineHeight: 20,
  },
}); 