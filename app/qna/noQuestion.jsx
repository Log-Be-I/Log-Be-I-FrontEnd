import { View, Text, Pressable, StyleSheet, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import NoQuestion from '../../assets/qna/noQuestion.svg'
import SaveButton from '../../components/qna/SaveButton';
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

      <View style={styles.buttonContainer}>
        <SaveButton onPress={() => router.push('/qna/register')} />
      </View>

      <View style={styles.iconcontainer}>
        <NoQuestion style={styles.icon} />
        <Text style={styles.text}>질문이 없습니다.</Text>
        <Text style={styles.text}> 궁금한 점에 대해 문의를 남겨주세요</Text>
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
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  iconcontainer: {
    flex: 1,
    paddingTop: 180,
    alignItems: 'center',
  },
  icon: {
    marginBottom: 40,
  },
  text: {
    fontSize: 18,
    fontWeight: '500',
    color: '#032B77',
    marginBottom: 10,
  },
});

