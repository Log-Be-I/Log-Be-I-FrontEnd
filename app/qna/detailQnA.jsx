import { View, Text, StyleSheet, Pressable, ScrollView, TextInput } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Icon from 'react-native-vector-icons/Ionicons';
import NoAnswer from '../../components/qna/NoAnswer';
import Button from '../../components/common/button';
import { getQuestionDetail } from '../../api/qna/qnaApi';
import { deleteMyQuestion } from '../../api/qna/qnaApi';
import Answer from '../../components/qna/Answer';
import { qnaData } from '../../dummyData/qnaData';
import SaveButton from '../../components/qna/SaveButton';
import { useState, useEffect } from 'react';
import Toast from '../../components/common/Toast';
import CancelModal from '../../components/common/CancelModal';

export default function DetailQnA() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [questionDetail, setQuestionDetail] = useState(null);

  const [isEditMode, setIsEditMode] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [charCount, setCharCount] = useState(0);

  const [showToast, setShowToast] = useState(false);
  const [showToastMessage, setShowToastMessage] = useState('');

  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const fetchMockDetail = () => {
      // 💡 숫자형 변환 주의
      const detail = qnaData.find((item) => item.id === Number(id));
      setQuestionDetail(detail);
    };

    fetchMockDetail();
  }, []);

  // API 호출 주석처리
  // useEffect(() => {
  //   const fetchQuestionDetail = async () => {
  //     try {
  //       const response = await getQuestionDetail(id);
  //       setQuestionDetail(response.data);
  //     } catch (error) {
  //       console.error('문의 상세 조회 실패:', error);
  //     }
  //   };
  //   fetchQuestionDetail();
  // }, []);

  //  Edit 버튼을 누르기 전에도 이미 editContent의 길이를 알 수 있고,
  // isEditMode일 때 charCount도 자연스럽게 보여진다.
  useEffect(() => {
    if(questionDetail) {
      setEditTitle(questionDetail.title);
      setEditContent(questionDetail.content);
      setCharCount(questionDetail.content.length);
    }
  }, [questionDetail]);

  const handleEdit = () => {
    setIsEditMode(true);
    // setEditTitle(title);
    // setEditContent(content);
  };

  const handleSaveEdit = async () => {
    try {
      await updateMyQuestion(id, {
        title: editTitle,
        content: editContent,
      });
      setShowToastMessage('수정이 성공하셨습니다.');
      setShowToast(true);
      
      // 성공 후 상태 리셋 및 새 데이터 반영
      setQuestionDetail(prev => ({
        ...prev,
        title: editTitle,
        content: editContent,
      }));
      setIsEditMode(false);

      setTimeout(() => {
        router.push({
          pathname:'/qna/',
          params: {
            updatedId: id,
            updatedTitle: editTitle,
            updatedContent: editContent,
          }});
      }, 2000);
    } catch (error) {
      console.error('문의 수정 실패:', error);
      setShowToastMessage('수정에 실패하셨습니다.');
      setShowToast(true);
    }
  };

  const handleBack = () => {
    router.back();
  };

  const handleContentChange = (text) => {
    if (text.length <= 500) {
      setEditContent(text);
      setCharCount(text.length);
    }
  };
// 모달열기
  const handleDelete = () => {
    setModalVisible(true);
  };

  // 실제 삭제 실행 함수 
  const handleDeleteConfirm = async () => {
    try {
      await deleteMyQuestion(id);

      setModalVisible(false);
      setShowToastMessage("삭제가 완료되었습니다.")
      setShowToast(true);

      setTimeout(() => {
        router.push('/qna/');
      }, 1500);
    } catch (err) {
      console.error('삭제 실패:', err);
      setShowToastMessage("삭제에 실패하셨습니다.");
      setShowToast(true);
      setModalVisible(false);
    }
  }

  if (!questionDetail) {
    return <Text>Loading...</Text>;
  } // 로딩 중 또는 빈화면 처리

  const { title, content, createAt, question_status, questionImage, answer } = questionDetail;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={handleBack} style={styles.backButton}>
          <Icon name="chevron-back" size={24} color="#000" />
        </Pressable>
        <Text style={styles.headerTitle}>QnA</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.questionHeader}>
          {question_status !== "QUESTION_ANSWERED" && !isEditMode && (
            <>
              <Button 
              text="Edit" 
              onPress={handleEdit} 
              textStyle={{color: '#69BAFF', fontSize: 14}}
              size="small"
              />
              <Button 
              text="Delete" 
              onPress={handleDelete} 
              textStyle={{color: '#FF7777', fontSize: 14}}
              size="small"
              />
            </>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>제목</Text>
          <View style={styles.titleContainer}>
            {isEditMode ? (
              <TextInput
                style={[styles.input, styles.titleInput]}
                value={editTitle}
                onChangeText={setEditTitle}
                placeholder="제목을 입력해주세요"
                placeholderTextColor="#9CA3AF"
              />
            ) : (
              <Text style={styles.input}>{title}</Text>
            )}
            <View style={styles.underline} />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>내용</Text>
          <View style={styles.contentContainer}>
            {isEditMode ? (
              <TextInput
                style={styles.input}
                value={editContent}
                onChangeText={handleContentChange}
                placeholder="내용을 입력해주세요"
                placeholderTextColor="#9CA3AF"
                multiline={true}
                textAlignVertical="top"
                scrollEnabled={true}
                maxLength={500}
                />
            ) : (
              <ScrollView>
                <Text>{content}</Text>
              </ScrollView>
            )}
          </View>
          {isEditMode ? (
            <Text style={styles.charCount}>{charCount}/500</Text>
          ) : (
            <Text style={styles.createAt}>{createAt}</Text>
          )}
        </View>

        {/* { questionImage && (
          <FileButton onPress={() => {}}>
            <File size={24} color='#E5E7EB' style={{alignSelf: 'center'}} />
          </FileButton>
        )} */}

        {!isEditMode && ( 
        question_status === "QUESTION_ANSWERED" && answer 
        ? <Answer answer={answer}/> 
        : <NoAnswer /> 
        )}

        {!isEditMode && (
          <SaveButton 
          onPress={handleBack} 
          style={{
          paddingVertical: 4,
          paddingHorizontal: 10,
          minWidth: 60,
          backgroundColor: '#61B9FF',
          alignSelf: 'center',
        }}>
          <Text style={styles.buttonText}>OK</Text>
        </SaveButton>
        )}
        
        {isEditMode && (
          <SaveButton 
          onPress={handleSaveEdit} 
          style={{
            paddingVertical: 4,
            paddingHorizontal: 10,
            minWidth: 60,
            backgroundColor: '#61B9FF',
            alignSelf: 'center',
          }}>
          <Text style={styles.buttonText}>Edit</Text>
          </SaveButton>
        )}
      </ScrollView> 
      <Toast
        visible={showToast}
        message={showToastMessage}
        onHide={() => setShowToast(false)}
        />

        <CancelModal
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onDelete={handleDeleteConfirm}
      />
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      bottom: 10,
    },
    titleInput: {
      paddingLeft: 12,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 20,
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
    },
    content: {
      flex: 1,
      padding: 20,
    },
    questionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      left: 150,
      gap: 16,
    },
    questionTitle: {
      flex: 1,
      fontSize: 16,
      color: '#1F2937',
    },
    section: {
      marginBottom: 24,
    },
    sectionLabel: {
      fontSize: 14,
      fontWeight: '500',
      color: '#4B5563',
      marginBottom: 8,
    },
    titleContainer: {
      gap: 4,
    },
    title: {
      fontSize: 16,
      color: '#1F2937',
    },
    underline: {
      height: 1,
      backgroundColor: '#E5E7EB',
    },
    charCount: {
      fontSize: 12,
      color: "#666666",
      textAlign: "right",
      marginTop: 6,
    },
    contentContainer: {
      padding: 16,
      borderRadius: 4,
      borderWidth: 1,
      borderColor: '#E5E7EB',
      height: 110,
      textAlignVertical: 'top',
    },
    contentText: {
      fontSize: 14,
      color: '#4B5563',
      lineHeight: 20,
    },
    attachedImage: {
      width: '100%',
      height: 200,
      borderRadius: 4,
    },
    createAt: {
      fontSize: 12,
      color: "#666666",
      textAlign: "right",
      marginTop: 6,
    },
    fileButtonContainer: {
      marginTop: 8,
    },
    saveButtonContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 6,
      paddingHorizontal: 12,
    },
    buttonText: {
      color: '#FFFFFF',
      fontWeight: 'bold',
    },
  });
  

