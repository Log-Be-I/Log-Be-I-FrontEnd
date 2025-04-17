import { View, Text, Pressable, StyleSheet, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import CustomSelectBox from '../../components/qna/CustomSelectBox';
import QnaCardWrapper from '../../components/qna/QnaCardWrapper';
import Pagination from '../../components/common/Pagination';
// import { getMyQuestion } from '../../api/qna/qnaApi';
import { qnaData } from '../../dummyData/qnaData';

export default function QnaPage() {
  const router = useRouter();
  const [selected, setSelected] = useState('latest');
  const [questions, setQuestions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [groupIndex, setGroupIndex] = useState(0);
  const itemsPerPage = 5;

  // 현재 페이지 이동시에 groupIndex 업데이트
  useEffect(() => {
    const newGroupIndex = Math.floor((currentPage - 1) / itemsPerPage);
    setGroupIndex(newGroupIndex);
  }, [currentPage]);

  useEffect(() => {
    fetchQuestions();
  }, [selected, currentPage]);

  const fetchQuestions = async () => {
    // API 호출 대신 더미 데이터 사용
    const sortedData = [...qnaData].sort((a, b) => {
      const dateA = new Date(a.createAt);
      const dateB = new Date(b.createAt);
      return selected === 'latest' ? dateB - dateA : dateA - dateB;
    });

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedData = sortedData.slice(startIndex, endIndex);

    setQuestions(paginatedData);
    setTotalPages(Math.ceil(qnaData.length / itemsPerPage));

    // API 호출 코드 (주석 처리)
    // try {
    //   const sortBy = selected === 'latest' ? 'desc' : 'asc';
    //   const response = await getMyQuestion(currentPage, 10, sortBy);
    //   setQuestions(response.data);
    //   setTotalPages(Math.ceil(response.total / 10));
    // } catch (error) {
    //   console.error('질문 조회 중 오류 발생:', error);
    // }
  };

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
      
      <View style={styles.dropdownContainer}>
        <CustomSelectBox
          selected={selected}
          setSelected={setSelected}
          options={[
            { key: 'latest', value: '최신글' },
            { key: 'oldest', value: '오래된 글' },
          ]}
        />
      </View>

      <FlatList
        style={{ overflow: 'visible' }}
        data={questions}
        renderItem={({ item }) => (
          <QnaCardWrapper
            title={item.title}
            createAt={item.createAt}
            status={item.question_status}
          />
        )}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        ListFooterComponent={
        <View>
          <View style={{ height: 8 }} />
          <View style={styles.paginationContainer}>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </View>
        </View>}
      />
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
  dropdownContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    position: 'relative',
  },
  listContainer: {
    paddingVertical: 8,
    paddingBottom: 32,
  },
  paginationContainer: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

