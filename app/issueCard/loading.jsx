import React, { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { getKeywords } from "../../api/issueCard/issueCardApi";

export default function LoadingPage() {
  const router = useRouter();

  useEffect(() => {
    const checkKeywords = async () => {
      try {
        const response = await getKeywords();

        if (response.data.length > 0) {
          router.replace('/issueCard/getIssueCard');
        } else {
          router.replace('/issueCard/');
        }
      } catch (error) {
        console.error('키워드 조회 실패:', error);
        router.replace('/issueCard/');
      }
    };

    checkKeywords();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  );
}
