import React, { useState, useRef } from 'react';
import { View, Text, ScrollView, StyleSheet, Animated, Pressable } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import NewsCard from '../../components/issueCard/issue/NewsCard';

const GetIssueCard = () => {
  const { keywords } = useLocalSearchParams();
  const parsedKeywords = keywords ? JSON.parse(keywords) : [];
  const [activeTab, setActiveTab] = useState(0);
  const slideAnim = useRef(new Animated.Value(0)).current;

  const handleTabPress = (index) => {
    const direction = index > activeTab ? 1 : -1;
    Animated.timing(slideAnim, {
      toValue: direction * -100,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setActiveTab(index);
      slideAnim.setValue(0);
    });
  };

  // 임시 뉴스 데이터
  const dummyNews = [
    {
      title: '출퇴근 시간대 지하철 운행 중단',
      content: '오늘 오전 출퇴근 시간대 지하철 2호선에서 신호 장애가 발생하여 약 30분간 운행이 중단되었습니다. 이로 인해 많은 시민들이 불편을 겪었으며, 서울교통공사는 신속한 복구 작업을 진행했다고 밝혔습니다.',
    },
    {
      title: '새로운 AI 기술 발표',
      content: '구글은 오늘 새로운 AI 모델을 발표했습니다. 이 모델은 기존 모델보다 30% 더 효율적이며, 특히 자연어 처리 분야에서 획기적인 성능 향상을 보여주고 있습니다.',
    },
    {
      title: '주식시장 강세',
      content: '글로벌 경제 지표 호조에 힘입어 국내 주식시장이 강세를 보이고 있습니다. 특히 IT와 반도체 업종이 상승을 주도하고 있으며, 외국인 투자자들의 매수세가 지속되고 있습니다.',
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <View style={styles.titleBorder} />
        <Text style={styles.title}>Daily <Text style={styles.titleHighlight}>I</Text>ssue</Text>
        <View style={styles.titleBorder} />
      </View>

      <View style={styles.tabContainer}>
        <View style={styles.tabBorder} />
        <View style={styles.tabs}>
          {parsedKeywords.map((keyword, index) => (
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
      </View>

      <Animated.View
        style={[
          styles.content,
          {
            transform: [{
              translateX: slideAnim.interpolate({
                inputRange: [-100, 0, 100],
                outputRange: ['100%', '0%', '-100%']
              })
            }]
          }
        ]}
      >
        <ScrollView>
          {dummyNews.map((news, index) => (
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  titleContainer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  titleBorder: {
    height: 1,
    width: '100%',
    backgroundColor: '#3650FA',
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
    backgroundColor: '#3650FA',
  },
  content: {
    flex: 1,
  },
});

export default GetIssueCard;
