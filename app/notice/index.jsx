import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import Icon from 'react-native-vector-icons/Ionicons';
import NoticeItem from '../../components/faq/NoticeItem';
import Pagination from '../../components/common/Pagination';
import NoticeButton from '../../components/faq/NoticeButton';
import { getAllNotices } from '../../api/notice/noticeApi';
import { format } from 'date-fns';

export default function NoticePage() {
  const router = useRouter();
  const [notices, setNotices] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [totalPages, setTotalPages] = useState(0);

  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  // 정렬된 공지사항 리스트를 state에 저장s
  useEffect(() => {
    fetchNotices();
  }, [currentPage]);

  const fetchNotices = async () => {
    try {
      const response = await getAllNotices({ page: 1 , size: 1000 });
      let fetchedNotices = response.data;

    //   //중요도 기준 설정
    //   const priority = { 'URGENT_PINNED': 2, 'PINNED_': 1, 'NONE': 0 };

    //   const sortedNotices = [...fetchedNotices].sort((a, b) => {
    //     if(priority[b.isPinned] !== priority[a.isPinned]) {
    //       return priority[b.isPinned] - priority[a.isPinned]; // 중요도 높은 순
    //     }
    //     //  중요도가 같으면 createdAt 기준 최신순
    //     return new Date(b.createdAt) - new Date(a.createdAt);
    //   });
    //   console.log("정렬된 데이터:", sortedNotices);
      
    //   setNotices(sortedNotices);
    //   setTotalPages(response.pageInfo.totalPages);
    // } catch (error) {
    //   console.error('공지사항 가져오기 실패:', error);


    // 1. 중요도별로 나누기
    const urgentPinned = fetchedNotices.filter(n => n.isPinned === 'URGENT_PINNED');
    const pinned = fetchedNotices.filter(n => n.isPinned === 'PINNED');
    const normal = fetchedNotices.filter(n => n.isPinned === 'NONE');

    // 2. 각각 정렬 (최신순)
    urgentPinned.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    pinned.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    normal.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // 3. 합치기 (중요공지 -> 일반공지)
    const sortedNotices = [...urgentPinned, ...pinned, ...normal];

    // 4. 페이지네이션 적용
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedNotices = sortedNotices.slice(startIndex, endIndex);

    setNotices(paginatedNotices);
    setTotalPages(Math.ceil(sortedNotices.length / itemsPerPage));
  } catch (error) {
    console.error('공지사항 가져오기 실패:', error);
  }
  };

  const handleBack = () => {
    router.back();
  };

  const handleNoticePress = (noticeId) => {
    router.push(`/notice/detailNotice?id=${noticeId}`);
  };

  return (
    <View style={styles.container}>
      <View>
        <View style={styles.header}>
          <Pressable onPress={handleBack} style={styles.backButton}>
            <Icon name="chevron-back" size={24} color="#000" />
          </Pressable>
          <Text style={styles.headerTitle}>공지사항</Text>
        </View>
      </View>

      <View style={styles.subHeader}>
        <Text style={styles.columnTitle}>제목</Text>
        <Text style={styles.columnDate}>생성일자</Text>
      </View>

      <View style={{flex: 1}}>
            {notices.map((notice) => {
              const formattedDate = format(new Date(notice.createdAt), 'yyyy-MM-dd');
              return (
              <Pressable
                key={notice.noticeId}
                style={styles.noticeItem}
                onPress={() => handleNoticePress(notice.noticeId)}
              >
                <View style={styles.noticeContent}>
                  <View style={styles.titleContainer}>
                    <NoticeButton isPinned={notice.isPinned} />
                    <Text style={styles.noticeTitle}>{notice.title}</Text>
                  </View>
                  <Text style={styles.noticeDate}>{formattedDate}</Text>
                </View>
              </Pressable>
              );
          })}
    </View>
    <View style={styles.paginationWrapper}>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
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
    fontSize: 25,
    fontWeight: '600',
    marginRight: 44, // backButton width + padding to center title
    color: '#82ACF1',
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
    marginLeft: 92,
  },
  columnDate: {
    width: 100,
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    textAlign: 'center',
  },
  noticeItem: {
    height: 70,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    justifyContent: 'center',
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
    gap: 20,
  },
  noticeTitle: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
    textAlign: 'left',   // 확실하게 왼쪽 정렬
  },
  noticeDate: {
    width: 100,
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  paginationWrapper: {
    // paddingTop: 20,
    // alignSelf: 'center',
    paddingVertical: 10,
    zIndex: 100,
    marginBottom: 160,
  },
});
