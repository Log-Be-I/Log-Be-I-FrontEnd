import { View, Text, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState, useEffect, useCallback } from 'react';
import CustomSelectBox from '../../components/qna/CustomSelectBox';
import QnaCardWrapper from '../../components/qna/QnaCardWrapper';
import Pagination from '../../components/common/Pagination';
import SaveButton from '../../components/qna/SaveButton';
import NoMyQuestion from '../../components/qna/NoMyQuestion';
import { getMyQuestions } from '../../api/qna/qnaApi';
import { format } from 'date-fns';

export default function QnaPage() {
  const router = useRouter();
  const [selected, setSelected] = useState('latest');
  const [questions, setQuestions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [groupIndex, setGroupIndex] = useState(0);
  const itemsPerPage = 4;
  const { keywords } = useLocalSearchParams();
  const [titleKeyword, setTitleKeyword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { updatedId, updatedTitle, updatedContent } = useLocalSearchParams();
  
  useFocusEffect(
    useCallback(() => {
      fetchQuestions();
    }, [selected, currentPage])
  );

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

  const fetchQuestions = async () => {
    setIsLoading(true);
    try { 
      const response = await getMyQuestions({ page: currentPage, size: itemsPerPage });

      // 삭제되지 않은 질문만 필터링
      const activeQuestions = response.data.filter(
        (item) => item.questionStatus !== 'QUESTION_DELETED'
      );
      
      // 필터링 된 데이터 기준으로 정렬렬
      const sortedData = [...activeQuestions].sort((a, b) => {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);
        return selected === 'latest' ? dateB - dateA : dateA - dateB;
      });

      // 키워드가 있으면 해당 제목을 가진 질문을 맨 앞으로 정렬
      if (titleKeyword) {
        sortedData.sort((a, b) => {
          const isA = a.title.includes(titleKeyword);
          const isB = b.title.includes(titleKeyword);
          if (isA && !isB) return -1;
          if (!isA && isB) return 1;
          return 0;
        });
      }
      // 페이지 수 재계산
      const recalculatedTotalPages = Math.ceil(sortedData.length / itemsPerPage);
      // 현재 페이지가 초과되면 보정
      if(currentPage > recalculatedTotalPages) {
        setCurrentPage(recalculatedTotalPages || 1); // 최소 1페이지 유지지
      }
      // 현재 페이지에 맞는 데이터 슬라이싱
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const paginationData = sortedData.slice(startIndex, endIndex);
      // 상태 반영
      setQuestions(paginationData);
      setTotalPages(recalculatedTotalPages);

    } catch (error) {
      console.error('질문 조회 중 오류 발생:', error);
    } finally {
      setIsLoading(false);
    }
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

      <View style={{ flex: 1 }}>
        {!isLoading && questions.length === 0 ? (
          <NoMyQuestion />
        ) : (
          <>
          {questions.map((item) => {
            const formattedDate = format(new Date(item.createdAt), 'yyyy-MM-dd');
            return (
            <QnaCardWrapper
              key={item.id}
              title={item.title}
              createdAt={formattedDate}
              questionAnswerStatus={item.questionAnswerStatus}
              onPress={() => {
                router.push({
                  pathname: `/qna/detailQnA`,
                  params: {
                    id: item.questionId,
                    title: item.title,
                    content: item.content,
                    createdAt: item.createdAt,
                    questionAnswerStatus: item.question_answer_status,
                    questionImage: item.question_image,
                  }
            })}}
          />
        );
      })}
      <View style={styles.paginationContainer}>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
        />      
      </View>
    </>
  )}
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
    position: 'absolute',
    bottom: 180,
    width: '100%',
    backgroundColor: 'white',
    zIndex: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
});

