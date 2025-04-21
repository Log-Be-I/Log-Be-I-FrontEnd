import { View, Text, Pressable, StyleSheet, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState, useEffect } from 'react';
import CustomSelectBox from '../../components/qna/CustomSelectBox';
import QnaCardWrapper from '../../components/qna/QnaCardWrapper';
import Pagination from '../../components/common/Pagination';
import SaveButton from '../../components/qna/SaveButton';
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
  const { keywords } = useLocalSearchParams();
  const [titleKeyword, setTitleKeyword] = useState('');

  const { updatedId, updatedTitle, updatedContent } = useLocalSearchParams();

  useEffect(() => {
    if (keywords) {
      try{ const parsedKeywords = JSON.parse(keywords); // title만 넘긴 경우에는 그냥 string으로 받음
        setTitleKeyword(parsedKeywords.title || '');
      } catch (error) {
        console.error('키워드 파싱 오류:', error);
      }
    }
  }, [keywords]);

  useEffect(() => {
    if (updatedId) {
      setQuestions(prev => prev.map(question => 
        question.id === Number(updatedId) ? { ...question, title: updatedTitle, content: updatedContent } 
        : question
      ));
    }
  }, [updatedId]);
  
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

    // 키워드가 있으면 해당 제목을 가진 질문을 맨 앞으로 정렬
    const prioritized = sortedData;
    if (titleKeyword) {
      prioritized = sortedData.sort((a, b) => {
        const isA = a.title.includes(titleKeyword);
        const isB = b.title.includes(titleKeyword);
        if (isA && !isB) return -1;
        if (!isA && isB) return 1;
        return 0;
      });
    }

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
      
      <View style={styles.buttonContainer}>
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
        <SaveButton onPress={() => router.push('/qna/register')}>
          <Text style={styles.butontext}>Register</Text>
        </SaveButton>
      </View>

      <FlatList
        style={{ overflow: 'visible' }}
        data={questions}
        renderItem={({ item }) => (
          <QnaCardWrapper
            title={item.title}
            createAt={item.createAt}
            status={item.question_status}
            onPress={() => router.push({
              pathname: `/qna/detailQnA`,
              params: {
                id: item.id,
                title: item.title,
                content: item.content,
                createAt: item.createAt,
                status: item.question_status,
                questionImage: item.question_image,
              }
            })}
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
    fontSize: 25,
    fontWeight: '600',
    marginRight: 44,
    color: '#82ACF1',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    zIndex: 100,
  },
  butontext: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  dropdownContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    position: 'relative',
    //right:280,
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

