import { Stack } from "expo-router";
import Header from '../../components/common/Header'
import Footer from '../../components/common/Footer'
import { SafeAreaView } from "react-native-safe-area-context";
import { View, StyleSheet } from "react-native";

export default function QnaLayout() {
  return (
    <SafeAreaView style={styles.container}>
        <Header />
        <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="noQuestion" options={{ headerShown: false }} />
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
