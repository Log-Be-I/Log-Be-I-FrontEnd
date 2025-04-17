import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Image, TextInput } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Icon from 'react-native-vector-icons/Ionicons';
import SaveButton from '../../components/qna/SaveButton';
import FileButton from '../../components/qna/fileButton';
import { postMyQuestion } from '../../api/qna/qnaApi';
import Toast from '../../components/common/Toast';

export default function RegisterQnaPage() {
  const router = useRouter();
  const [titleValue, setTitleValue] = useState('');
  const [contentValue, setContentValue] = useState('');
  const [charCount, setCharCount] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');



  const handleBack = () => {
    router.back();
  };

  const handleContentChange = (text) => {
    if (text.length <= 500) {
      setContentValue(text);
      setCharCount(text.length);
    }
  };

  const handlePostQuestion = async() => {
    try {
        await postMyQuestion(token, memberId, titleValue, contentValue, questionImage);
        setToastMessage('문의가 등록되었습니다.');
        setShowToast(true);
        setTimeout(() => {
            router.replace({
            pathname: '/qna/',
            params: { keywords: JSON.stringify(titleValue)}
        });
      }, 1000);
    } catch (error) {
        console.error('문의 등록 실패:', error);
        setToastMessage('문의 등록에 실패했습니다.');
        setShowToast(true);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={handleBack} style={styles.backButton}>
          <Icon name="chevron-back" size={24} color="#000" />
        </Pressable>
        <Text style={styles.headerTitle}>QnA 등록</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.questionHeader}>
          <Text style={styles.questionTitle}></Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>제목</Text>
          <View style={styles.titleContainer}>
            <TextInput
                style={styles.input}
                placeholder="무엇이 궁금하신가요?"
                placeholderTextColor="#9CA3AF"
                value={titleValue}
                onChangeText={setTitleValue} // 값 변경시 자동 업데이트트
            />
            <View style={styles.underline} />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>내용</Text>
          <View style={styles.contentContainer}>
            <TextInput
              placeholder="자세한 내용을 적어주시면 더 정확히 답변드릴 수 있어요."
              placeholderTextColor="#9CA3AF"
              value={contentValue}
              onChangeText={handleContentChange} // 값 변경시 자동 업데이트
              multiline={true}
              textAlignVertical="top"
              scrollEnabled={true}
              maxLength={500}
            />
          </View>
          <Text style={styles.charCount}>{charCount}/500</Text>
        </View>
        <View style={styles.fileButtonContainer}>
            <FileButton onPress={() => {}}>
                <Icon name='document-attach' size={24} color='#E5E7EB' style={{alignSelf: 'center'}} />
            </FileButton>
        </View>
        <View style={styles.saveButtonContainer}>
            <SaveButton style={styles.icon} onPress={handlePostQuestion}>
                <Text style={styles.buttonText}>Save</Text>
            </SaveButton>
        </View>
      </ScrollView>
      <Toast
        visible={showToast}
        message={toastMessage}
        onHide={() => setShowToast(false)}
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
    gap: 8,
    marginBottom: 20,
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
  contentContainer: {
    padding: 16,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    height: 200,
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
  charCount: {
    fontSize: 12,
    color: "#666666",
    textAlign: "right",
    marginTop: 6,
  },
  fileButtonContainer: {
    marginTop: 8,
  },
  saveButtonContainer: {
    alignItems: 'flex-end',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  }
});
