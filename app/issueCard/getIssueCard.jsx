import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Animated,
  Pressable,
} from "react-native";
import { useRouter } from "expo-router";
import NewsCard from "../../components/issueCard/issue/NewsCard";
import Icon from "react-native-vector-icons/Ionicons";
import Button from "../../components/common/button";
import { getKeywords } from "../../api/issueCard/issueCardApi";
import { ActivityIndicator } from "react-native";
import { useMemberStore } from "../../zustand/stores/member";
import { format } from "date-fns";
import { BackHandler } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

export default function GetIssueCard() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [cards, setCards] = useState([]);
  const [keywords, setKeywords] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const fetchKeywords = async () => {
      try {
        const response = await getKeywords();
        // const parsedData = response.data.map(item => ({
        //     keyword: item.keyword,
        //     news: item.news,
        //   }
        // ));
        setKeywords(response.data); // 전체 키워드 + 뉴스 리스트 세팅
        setCards(response.data[0].news); // 첫번째 키워드의 뉴스로 초기 세팅
      } catch (error) {
        console.error("키워드 조회 실패:", error);
      } finally {
        setIsLoading(false); // 키워드가 없더라도 로딩 종료
      }
    };

    fetchKeywords();
  }, []); // paramKeywords 의존성 제거 (라우터 파라미터는 변경되지 않음)

  useEffect(() => {
    if (keywords[activeTab]) {
      setCards(keywords[activeTab].news);
    }
  }, [activeTab, keywords]);

  useFocusEffect(
    useCallback(() => {
      const backAction = () => {
        router.replace("/(tabs)/");
        return true;
      };

      BackHandler.addEventListener("hardwareBackPress", backAction);

      return () => BackHandler.removeEventListener("hardwareBackPress", backAction);
    }, [])
  );

  const handleEdit = () => {
    router.push({
      pathname: "/issueCard",
      params: { editKeywords: JSON.stringify(keywords.map(k => k.keyword)) }, // 기존키워드 넘기기기
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
              <Pressable
                onPress={() => router.replace("/(tabs)/")}
                style={styles.backButton}
              >
                <Icon name="chevron-back" size={24} color="#000" />
              </Pressable>
              <View style={styles.titleWrapper}>
                <Text style={styles.title}>
                  Daily <Text style={styles.titleHighlight}>I</Text>ssue
                </Text>
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
                  style={[styles.tab, activeTab === index && styles.activeTab]}
                  onPress={() => handleTabPress(index)}
                >
                  <Text style={styles.tabText}>{keyword.keyword}</Text>
                  {activeTab === index && (
                    <View style={styles.activeIndicator} />
                  )}
                </Pressable>
              ))}
            </View>
            <View style={styles.tabBorder} />
          </View>

          <Animated.View
            style={[
              styles.content,
              {
                transform: [
                  {
                    translateX: slideAnim.interpolate({
                      inputRange: [-100, 0, 100],
                      outputRange: [100, 0, 100],
                    }),
                  },
                ],
              },
            ]}
          >
            {cards.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Icon name="newspaper-outline" size={80} color="#ccc" />
                <Text style={styles.emptyText}>조회된 뉴스가 없습니다</Text>
              </View>
            ) : (
            <ScrollView>
              {(cards || []).map((news, index) => (
                <NewsCard
                  key={index}
                  title={news.title}
                  content={news.description}
                  pubDate={format(new Date(news.pubDate), 'yyyy-MM-dd')}
                  onPress={() => {
                    // 뉴스 상세 페이지로 이동
                    router.push(news.link);
                  }}
                />
              ))}
            </ScrollView>
          )}
          </Animated.View>
          <View style={styles.editButtonContainer}>
            <Button
              text="Edit"
              size="large"
              textStyle={{ color: "#69BAFF" }}
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
    backgroundColor: "#fff",
    paddingTop: 20,
    paddingBottom: 20,
  },
  titleContainer: {
    paddingVertical: 20,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    paddingHorizontal: 20,
  },
  titleBorder: {
    height: 1,
    width: "100%",
    backgroundColor: "#3650FA",
  },
  backButton: {
    position: "absolute",
    left: 20,
    paddingVertical: 8,
    zIndex: 10,
  },
  titleWrapper: {
    flex: 1,
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginVertical: 10,
  },
  titleHighlight: {
    color: "#1170DF",
  },
  tabContainer: {
    marginBottom: 20,
  },
  tabBorder: {
    height: 1,
    width: "100%",
    backgroundColor: "#3650FA",
  },
  tabs: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingTop: 10,
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    position: "relative",
  },
  tabText: {
    fontSize: 16,
    fontWeight: "500",
  },
  activeIndicator: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: "#1E3A8A",
  },
  editButtonContainer: {
    position: "absolute",
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#032B77',
    marginTop: 10,
  },
});
