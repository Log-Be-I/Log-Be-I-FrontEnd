import React, { useEffect, useState } from 'react';
import { Stack, useRouter } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { getKeywords } from '../../api/issueCard/issueCardApi';
import useAuthStore from '../../zustand/stores/authStore';

export default function IssueCardLayout() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkKeywords = async () => {
      try {
        const response = await getKeywords();

        if (response && response.data.length > 0) {
          router.replace({
            pathname: '/issueCard/getIssueCard',
            params: { keywords: JSON.stringify(response.data) }
          }); return;
        } else {
          router.replace('/issueCard/'); 
          return;
        }
      } catch (error) {
        console.error('키워드 조회 실패:', error);
        router.replace('/issueCard/'); return;
      } finally {
        setIsLoading(false);
      }
    };

    checkKeywords();
  }, []);

//  // 로딩 중일때 Stack을 렌더링 X.
// if(isLoading) {
//   return (
//     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//       <ActivityIndicator size="large" color="#0000ff" />
//     </View>
//   )
// };

  // 로디이 끝난 후 Staxk 렌더링 (사실상 여기 도달하기 전에 router.replace로 이동)
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="getIssueCard" />
    </Stack>
  );
}