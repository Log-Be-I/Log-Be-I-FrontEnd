import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import Icon from 'react-native-vector-icons/Ionicons';
import NoticeItem from '../../components/faq/NoticeItem';
import Pagination from '../../components/common/Pagination';
import NoticeButton from '../../components/faq/NoticeButton';
import { mockNotices } from '../../components/faq/mockData';

export default function NoticePage() {
  const router = useRouter();
  const [notices, setNotices] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage] = useState(4);
  const totalPages = Math.ceil(notices.length / itemsPerPage);
  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  // 정렬된 공지사항 리스트를 state에 저장장
  useEffect(() => {
    setNotices(sortedNotices);
  }, []);
// 페이지에서 보여줄 공지들들
  const pageNotices = notices.slice(startIndex, endIndex);
  

  const handleBack = () => {
    router.back();
  };

  const handleNoticePress = (noticeId) => {
    router.push(`/notice/detailNotice?id=${noticeId}`);
  };

  // mockNotices를 날짜순으로 정렬하고 중요도순으로 정렬
  const sortedNotices = [...mockNotices].sort((a, b) => {
    if (a.importance !== b.importance) {
      return b.importance ? 1 : -1;
    }
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={handleBack} style={styles.backButton}>
          <Icon name="chevron-back" size={24} color="#000" />
        </Pressable>
        <Text style={styles.headerTitle}>공지사항</Text>
      </View>

      <View style={styles.subHeader}>
        <Text style={styles.columnTitle}>제목</Text>
        <Text style={styles.columnDate}>생성일자</Text>
      </View>

      <ScrollView style={styles.noticeList}>
        {pageNotices.map((notice) => (
          <Pressable
            key={notice.id}
            style={styles.noticeItem}
            onPress={() => handleNoticePress(notice.id)}
          >
            <View style={styles.noticeContent}>
              <View style={styles.titleContainer}>
                <NoticeButton importance={notice.importance} />
                <Text style={styles.noticeTitle}>{notice.title}</Text>
              </View>
              <Text style={styles.noticeDate}>{notice.createdAt}</Text>
            </View>
          </Pressable>
        ))}
      </ScrollView>
      <View style={{paddingBottom: 16, alignSelf: 'center'}}>
        <Pagination
          currentPage={currentPage + 1}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page - 1)}
        />
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
    marginRight: 44, // backButton width + padding to center title
    color: '#0A4DAA',
  },
  subHeader: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  columnTitle: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    marginLeft: 55,
  },
  columnDate: {
    width: 100,
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    textAlign: 'center',
  },
  noticeList: {
    flex: 1,
  },
  noticeItem: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  noticeContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  noticeTitle: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
  },
  noticeDate: {
    width: 100,
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
});
