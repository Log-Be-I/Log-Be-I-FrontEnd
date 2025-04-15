import React, { useEffect, useState } from 'react';
import { Stack, useRouter } from 'expo-router';
import { getKeywords } from '../../api/issueCard/issueCardApi';


export default function IssueCardLayout() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkKeywords = async () => {
      try {
        const response = await getKeywords();
        if (response && response.length > 0) {
          router.replace({
            pathname: '/issueCard/getIssueCard',
            params: { keywords: JSON.stringify(response.map(item => item['keyword-name'])) }
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

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="getIssueCard" />
    </Stack>
  );
}