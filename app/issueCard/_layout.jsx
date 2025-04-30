import React, { useEffect, useState } from "react";
import { Stack, useRouter } from "expo-router";
import { View, ActivityIndicator } from "react-native";
import { getKeywords } from "../../api/issueCard/issueCardApi";

export default function IssueCardLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="loading" />
      <Stack.Screen name="index" />
      <Stack.Screen name="getIssueCard" />
    </Stack>
  );
}