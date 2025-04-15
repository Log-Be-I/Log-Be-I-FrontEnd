import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Image } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Icon from 'react-native-vector-icons/Ionicons';
import NoticeButton from '../../components/faq/NoticeButton';
import { mockNotices } from '../../components/faq/mockData';

export default function DetailFaqPage() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    // Mock data에서 해당 id의 공지사항 찾기
    const foundNotice = mockNotices.find(notice => notice.id === Number(id));
    setNotice(foundNotice);
  }, [id]);

  const handleBack = () => {
    router.push('/faq');
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
          <NoticeButton importance={notice.importance} />
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

        {notice.image && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>첨부파일</Text>
            <Image 
              source={{ uri: notice.image }} 
              style={styles.attachedImage} 
              resizeMode="contain"
            />
          </View>
        )}
      </ScrollView>
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
    fontSize: 18,
    fontWeight: '600',
    marginRight: 44,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  noticeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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
});
