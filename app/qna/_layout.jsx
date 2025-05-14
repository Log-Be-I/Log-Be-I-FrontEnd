import { Stack, useRouter } from "expo-router";
import Footer from '../../components/common/Footer'
import { SafeAreaView } from "react-native-safe-area-context";
import { View, StyleSheet } from "react-native";
import { useEffect, useState } from 'react';
import { getMyQuestions } from '../../api/qna/qnaApi';

export default function QnaLayout() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  const handleTabPress = (tab) => {
    switch (tab) {
      case 'index':
        router.push('/');
        break;
      case 'record':
        router.push('/record');
        break;
      case 'calendar':
        router.push('/calendar');
        break;
      case 'settings':
        router.push('/settings');
        break;
      default:
        console.log('Invalid tab');
        break;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
        <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="register" options={{ headerShown: false }} />
        <Stack.Screen name="detailQnA" options={{ headerShown: false }} />
        </Stack>
        <Footer onTabPress={handleTabPress} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
