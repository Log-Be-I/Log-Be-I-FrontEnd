import React, { useState, useRef, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Animated, Pressable } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import NewsCard from '../../components/issueCard/issue/NewsCard';
import Icon from 'react-native-vector-icons/Ionicons';
import Button from '../../components/common/button';
import { getKeywords } from '../../api/issueCard/issueCardApi';
import { ActivityIndicator } from 'react-native';
import useAuthStore from '../../zustand/stores/authStore';

export default function GetIssueCard() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [cards, setCards] = useState([]);
  const { keywords: paramKeywords } = useLocalSearchParams();
  const [keywords, setKeywords] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const memberId = useAuthStore((state) => state.memberId);

  useEffect(() => {
    const fetchKeywords = async () => {
      try {
        // URL 파라미터로 전달된 키워드가 있으면 사용
        if (paramKeywords) {
          const parsedKeywords = JSON.parse(paramKeywords);
          setKeywords(parsedKeywords);
          setIsLoading(false); // 키워드 설정되었으면 로딩 종료료
          return;
        }
        // 없으면 API 호출
        const response = await getKeywords(memberId);
        if (response && response.length > 0) {
          setKeywords(response.map(item => item['keyword-name']));
        }
      } catch (error) {
        console.error('키워드 조회 실패:', error);
      } finally {
        setIsLoading(false); // 키워드가 없더라도 로딩 종료
      }
    };

    fetchKeywords();
  }, []); // 🔥 paramKeywords 의존성 제거 (라우터 파라미터는 변경되지 않음)

 // 키워드 변경 시 뉴스 가져오기
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get(`/news?keyword=${keywords[activeTab].name}`);
        setCards(response.data);
      } catch (error) {
        console.error('뉴스 가져오기 실패:', error);
      }
    };
  
    if (keywords[activeTab]) {
      fetchNews();
    }
  }, [activeTab, keywords]);
  


  const handleEdit = () => {
    router.push({
      pathname: '/issueCard',
      params: { editKeywords: JSON.stringify(keywords) } // 기존키워드 넘기기기
    });
  };

  const handleTabPress = (index) => {
    if (index === activeTab) return;

    const direction = index > activeTab ? 1 : -1;
    setActiveTab(index);
    slideAnim.setValue(direction * 100);

    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={styles.container}>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : (
        <>
      <View style={styles.titleContainer}>
        <View style={styles.titleBorder} />
        <View style={styles.titleRow}>
          <Pressable onPress={() => router.replace('/')} style={styles.backButton}>
            <Icon name="chevron-back" size={24} color="#000" />
          </Pressable>
          <View style={styles.titleWrapper}>
            <Text style={styles.title}>Daily <Text style={styles.titleHighlight}>I</Text>ssue</Text>
          </View>
        </View>
        <View style={styles.titleBorder} />
      </View>

      <View style={styles.tabContainer}>
        <View style={styles.tabBorder} />
        <View style={styles.tabs}>
          {keywords.map((keyword, index) => (
            <Pressable
              key={index}
              style={[
                styles.tab,
                activeTab === index && styles.activeTab
              ]}
              onPress={() => handleTabPress(index)}
            >
              <Text style={styles.tabText}>{keyword.name}</Text>
              {activeTab === index && <View style={styles.activeIndicator} />}
            </Pressable>
          ))}
        </View>
        <View style={styles.tabBorder} />
      </View>

      <Animated.View
        style={[
          styles.content,
          {
            transform: [{
              translateX: slideAnim.interpolate({
                inputRange: [-100, 0, 100],
                outputRange: ['-100%', '0%', '100%']
              })
            }]
          }
        ]}
      >
        <ScrollView>
          {cards.map((news, index) => (
            <NewsCard
              key={index}
              title={news.title}
              content={news.summary}
              onPress={() => {
                // 뉴스 상세 페이지로 이동
                router.push(news.link);
              }}
            />
          ))}
        </ScrollView>
        
      </Animated.View>
      <View style={styles.editButtonContainer}>
      <Button
            text="Edit"
            size="large"
            textStyle={{color: "#69BAFF"}}
            onPress={handleEdit}
            style={styles.editButton}
          />
      </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 20,
    paddingBottom: 20,
  },
  titleContainer: {
    paddingVertical: 20,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    paddingHorizontal: 20,
  },
  titleBorder: {
    height: 1,
    width: '100%',
    backgroundColor: '#3650FA',
  },
  backButton: {
    position: 'absolute',
    left: 20,
    paddingVertical: 8,
    zIndex: 10,
  },
  titleWrapper: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  titleHighlight: {
    color: '#1170DF',
  },
  tabContainer: {
    marginBottom: 20,
  },
  tabBorder: {
    height: 1,
    width: '100%',
    backgroundColor: '#3650FA',
  },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 10,
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    position: 'relative',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#1E3A8A',
  },
  editButtonContainer: {
    position: 'absolute',
    bottom: 60,
    right: 30,
    zIndex: 10,
  },
  editButton: {
    right: 20,
    zIndex: 10,
  },
  content: {
    flex: 1,
  },
});
