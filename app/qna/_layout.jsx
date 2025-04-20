import { Stack, useRouter } from "expo-router";
import Header from '../../components/common/Header'
import Footer from '../../components/common/Footer'
import { SafeAreaView } from "react-native-safe-area-context";
import { View, StyleSheet } from "react-native";
import { useEffect, useState } from 'react';
import { getMyQuestions } from '../../api/qna/qnaApi';

export default function QnaLayout() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  
  // //나의 문의 페이지 분기
  // useEffect(() => {
  //   const checkQuestion = async () => {
  //     try {
  //       const response = await getMyQuestions();
  //       console.log(response);
  //       if (response && response.data.length > 0) {
  //         router.replace('/qna/noQuestion');
  //       } else {
  //         router.replace('/qna/');
  //       }
  //     } catch (error) {
  //       console.error('키워드 조회 실패:', error);
  //       router.replace('/qna/noQuestion');
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  //   checkQuestion();
  // }, []);

  return (
    <SafeAreaView style={styles.container}>
        <Header />
        <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="noQuestion" options={{ headerShown: false }} />
        <Stack.Screen name="register" options={{ headerShown: false }} />
        <Stack.Screen name="detailQnA" options={{ headerShown: false }} />
        </Stack>
        <Footer />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
