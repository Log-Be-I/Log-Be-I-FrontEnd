import React, { useEffect, useState } from 'react';
import { Stack, useRouter } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { getKeywords } from '../../api/issueCard/issueCardApi';
import useAuthStore from '../../zustand/stores/authStore';

export default function IssueCardLayout() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const memberId = useAuthStore((state) => state.user.memberId);

  useEffect(() => {
    const checkKeywords = async () => {
      try {
        const response = await getKeywords(memberId);

        if (response && response.data.length > 0) {
          router.replace({
            pathname: '/issueCard/getIssueCard',
            params: { keywords: JSON.stringify(response.data.map(item => item.name)) }
          });
        } else {
          router.replace('/issueCard/');
        }
      } catch (error) {
        console.error('키워드 조회 실패:', error);
        router.replace('/issueCard/');
      } finally {
        setIsLoading(false);
      }
    };

    checkKeywords();
  }, []);

  //   return (
  //     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
  //       <ActivityIndicator size="large" color="#0000ff" />
  //     </View>
  //   )
  // }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="getIssueCard" />
    </Stack>
  );
}