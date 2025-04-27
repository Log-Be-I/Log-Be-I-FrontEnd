import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import InterestButton from '../../components/issueCard/InterestButton';
import SearchInput from '../../components/issueCard/SearchInput';
import StartButton from '../../components/issueCard/StartButton';
import Toast from '../../components/common/Toast';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { postKeywords } from '../../api/issueCard/issueCardApi';

export default function IssueCardPage() {
  const router = useRouter();
  const searchParams = useLocalSearchParams();
  const editKeywords = searchParams?.editKeywords ?? '';
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [customInterests, setCustomInterests] = useState([]);
  const [showToast, setShowToast] = useState(false);

  const interestCategories = [
    [
      { title: 'IT', icon: '💻' },
      { title: '스포츠', icon: '⚽' },
    ],
    [
      { title: '건강/웰빙', icon: '🌿' },
      { title: '연예/K-POP', icon: '🎵' },
    ],
    [
      { title: '경제/금융', icon: '💰' },
      { title: '사회/정치', icon: '🗳' },
    ],
    [
      { title: '여행/음식', icon: '✈️' },
      { title: '자기계발', icon: '📚' },
    ],
  ];

  useEffect(() => {
    if (editKeywords) {
      const parsedKeywords = JSON.parse(editKeywords);

      const knownTitles = interestCategories.flatMap(row => row.map(item => item.title));

      const keywordNames = parsedKeywords.map(keyword => keyword.name);
      // 선택된 카테고리 키워드
      const predefined = parsedKeywords.filter(title => knownTitles.includes(title));
      // 사용자가 입력한 커스텀 키워드
      const custom = parsedKeywords.filter(title => !knownTitles.includes(title));

      setSelectedInterests(predefined); // 기존 선택
      setCustomInterests(custom);
    } else {
      setSelectedInterests([]); // 신규 진입 시 초기화
      setCustomInterests([]);
    }
  }, [editKeywords]);

  const handleBack = () => {
    router.back();
  };

  const handleInterestSelect = (title) => {
    setSelectedInterests(prev => {
      const isSelected = prev.includes(title);
      if (isSelected) {
        return prev.filter(item => item !== title);
      } else {
        if (getTotalSelectedCount() >= 3) {
          setShowToast(true);
          return prev;
        }
        return [...prev, title];
      }
    });
  };

  const getTotalSelectedCount = () => {
    return selectedInterests.length + customInterests.length;
  };

  const handleRegister = () => {
    if (!searchKeyword.trim()) return;
    
    if (getTotalSelectedCount() >= 3) {
      setShowToast(true);
      return;
    }

    setCustomInterests(prev => [...prev, searchKeyword.trim()]);
    setSearchKeyword('');
  };

  const handleCustomInterestPress = (interest) => {
    setCustomInterests(prev => prev.filter(item => item !== interest));
  };

  const handleStart = async () => {
    const allKeywords = [...selectedInterests, ...customInterests].map(keyword => ({ name: keyword }));

    if (allKeywords.length === 0) {
      setShowToast(true);
      return;
    }
    
    try {
      await postKeywords(allKeywords);
      router.replace(`/issueCard/getIssueCard?keywords=${encodeURIComponent(JSON.stringify(allKeywords))}`);
    } catch (error) {
      console.error('키워드 등록 실패:', error);
      setShowToast(true);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Pressable onPress={handleBack} style={styles.backButton}>
            <Icon name="chevron-back" size={24} color="#000" />
          </Pressable>
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>관심사를 선택해주세요.</Text>
          <Text style={styles.subtitle}>
            매일 요약 받고 싶은 이슈 3가지를 선택하거나, 직접 입력할 수 있어요.
          </Text>

          <View style={styles.buttonGrid}>
            {interestCategories.map((row, rowIndex) => (
              <View key={rowIndex} style={styles.buttonRow}>
                {row.map((item, colIndex) => (
                  <InterestButton
                    key={colIndex}
                    title={item.title}
                    icon={item.icon}
                    isSelected={selectedInterests.includes(item.title)}
                    onPress={() => handleInterestSelect(item.title)}
                  />
                ))}
              </View>
            ))}
          </View>

          <Text style={styles.inputLabel}>관심 키워드를 입력하세요.</Text>
          <SearchInput
            value={searchKeyword}
            onChangeText={setSearchKeyword}
            onRegister={handleRegister}
          />

          <View style={styles.customInterestsContainer}>
            {customInterests.map((interest, index) => (
              <InterestButton
                key={index}
                title={interest}
                icon={<Icon name="close-circle-outline" size={18} color="#3B5BA9" />}
                isSelected={true}
                onPress={() => handleCustomInterestPress(interest)}
              />
            ))}
          </View>
        </View>

        <StartButton onPress={handleStart} />
      </ScrollView>

      <Toast
        visible={showToast}
        message="최대 3개까지의 키워드 등록이 가능합니다"
        onHide={() => setShowToast(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingBottom: 60,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  backButton: {
    padding: 5,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
  },
  buttonGrid: {
    marginBottom: 30,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 50,
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  customInterestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 20,
  },
});