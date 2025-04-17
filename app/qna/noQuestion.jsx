import { View, Text, Pressable, StyleSheet, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
// import { getMyQuestion } from '../../api/qna/qnaApi';
import { qnaData } from '../../dummyData/qnaData';

export default function QnaPage() {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={handleBack} style={styles.backButton}>
          <Icon name="chevron-back" size={24} color="#000" />
        </Pressable>
        <Text style={styles.headerTitle}>나의 QnA</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    padding: 10,
    marginLeft: 10,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
    marginRight: 44,
    color: '#032B77',
  }
});

