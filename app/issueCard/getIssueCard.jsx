import React, { useState, useRef, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Animated, Pressable } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import NewsCard from '../../components/issueCard/issue/NewsCard';
import Icon from 'react-native-vector-icons/Ionicons';
import Button from '../../components/common/button';
import { getKeywords } from '../../api/issueCard/issueCardApi';
import { ActivityIndicator } from 'react-native';
export default function GetIssueCard() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [cards, setCards] = useState([]);
  const { keywords: paramKeywords } = useLocalSearchParams();
  const [keywords, setKeywords] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const slideAnim = useRef(new Animated.Value(0)).current;

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
        const response = await getKeywords();
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
  }, [paramKeywords]);

  const handleEdit = () => {
    router.push({
      pathname: '/issueCard',
      params: { editKeywords: JSON.stringify(keywords) }
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

  // Mock news data for each keyword
  const mockNewsData = {
    'IT/기술': [
      {
        title: '새로운 AI 기술 발표',
        content: '구글은 오늘 새로운 AI 모델을 발표했습니다. 이 모델은 기존 모델보다 30% 더 효율적이며, 특히 자연어 처리 분야에서 획기적인 성능 향상을 보여주고 있습니다.',
      },
      {
        title: '삼성전자 신제품 출시',
        content: '삼성전자가 새로운 스마트폰을 출시했습니다. 혁신적인 폴더블 디스플레이와 향상된 카메라 성능이 특징입니다.',
      },
      {
        title: '메타버스 시장 성장',
        content: '글로벌 메타버스 시장이 급성장하고 있습니다. 주요 기업들의 투자가 이어지고 있으며, 새로운 비즈니스 모델이 등장하고 있습니다.',
      },
    ],
    '경제/금융': [
      {
        title: '주식시장 강세',
        content: '글로벌 경제 지표 호조에 힘입어 국내 주식시장이 강세를 보이고 있습니다. 특히 IT와 반도체 업종이 상승을 주도하고 있습니다.',
      },
      {
        title: '금리 동결 결정',
        content: '한국은행이 기준금리를 현행 수준에서 동결하기로 결정했습니다. 물가안정과 경제성장을 고려한 결정이라고 밝혔습니다.',
      },
      {
        title: '원화 강세',
        content: '글로벌 달러 약세 영향으로 원화 가치가 상승하고 있습니다. 수출기업들의 실적에 미치는 영향이 주목됩니다.',
      },
    ],
    '건강/웰빙': [
      {
        title: '새로운 치료제 개발',
        content: '국내 제약회사가 혁신적인 항암제를 개발했습니다. 임상시험에서 높은 효과를 보여 기대를 모으고 있습니다.',
      },
      {
        title: '건강보험 정책 변경',
        content: '정부가 새로운 건강보험 정책을 발표했습니다. 의료 서비스 접근성 향상과 의료비 부담 경감이 주요 내용입니다.',
      },
    ],
    '스포츠': [
      {
        title: '월드컵 예선 승리',
        content: '한국 축구 대표팀이 2026 월드컵 예선에서 승리를 거뒀습니다. 이로써 본선 진출 가능성이 한층 높아졌습니다.',
      },
      {
        title: '프로야구 개막',
        content: '2024 KBO 리그가 개막했습니다. 각 구단은 우승을 향한 새로운 도전을 시작했습니다.',
      },
    ],
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
              <Text style={styles.tabText}>{keyword}</Text>
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
        {/*{dummyNews.map((news, index) => ( */}
          {keywords[activeTab] && mockNewsData[keywords[activeTab]]?.map((news, index) => (
            <NewsCard
              key={index}
              title={news.title}
              content={news.content}
              onPress={() => {
                // 뉴스 상세 페이지로 이동
              }}
            />
          ))}
        </ScrollView>
      </Animated.View>
      <View style={styles.editButtonContainer}>
      <Button
            text="Edit"
            size="medium"
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
    bottom: 20,
    right: 20,
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
