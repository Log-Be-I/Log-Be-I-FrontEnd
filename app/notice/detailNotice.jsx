import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Image } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Icon from 'react-native-vector-icons/Ionicons';
import NoticeButton from '../../components/faq/NoticeButton';
import { getNoticeById } from '../../api/notice/noticeApi';
import SaveButton from '../../components/qna/SaveButton';

export default function DetailNoticePage() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    const fetchNoticeDetail = async () => {
      try {
        const response = await getNoticeById(id);
        setNotice(response.data);
      } catch (error) {
        console.error('공지사항 상세 조회 실패:', error);
      }
    };
    if (id) {
      fetchNoticeDetail();
    }
  }, [id]);

  const handleBack = () => {
    router.back();
  };

  if (!notice) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={handleBack} style={styles.backButton}>
          <Icon name="chevron-back" size={24} color="#000" />
        </Pressable>
        <Text style={styles.headerTitle}>공지사항</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.noticeHeader}>
          <NoticeButton isPinned={notice.isPinned} />
          <Text style={styles.noticeTitle}>{notice.title}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>제목</Text>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{notice.title}</Text>
            <View style={styles.underline} />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>내용</Text>
          <View style={styles.contentContainer}>
            <Text style={styles.contentText}>{notice.content}</Text>
          </View>
        </View>

        {notice.fileUrls && notice.fileUrls.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>첨부파일</Text>
            <ScrollView horizontal style={styles.imageScroll}>
              {notice.fileUrls.map((url, index) => (
                <Image 
                  key={index}
                  source={{ uri: url }} 
                  style={styles.attachedImage} 
                  resizeMode="contain"
                />
              ))}
            </ScrollView>
          </View>
        )}
      </ScrollView>
      <SaveButton 
          onPress={handleBack} 
          style={{
          paddingVertical: 4,
          paddingHorizontal: 10,
          minWidth: 60,
          backgroundColor: '#61B9FF',
          alignSelf: 'center',
          marginBottom: 160,
        }}>
          <Text style={styles.buttonText}>OK</Text>
        </SaveButton>
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
    fontSize: 25,
    fontWeight: '600',
    marginRight: 44,
    color: '#82ACF1',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  noticeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    marginBottom: 20,
  },
  noticeTitle: {
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
    minHeight: 200,
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
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  attachmentIcon: {
    marginLeft: 8,
  },
  attachedImage: {
    width: 150,
    height: 150,
    marginRight: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  imageScroll: {
    flexDirection: 'row',
    marginTop: 10,
  },
});
