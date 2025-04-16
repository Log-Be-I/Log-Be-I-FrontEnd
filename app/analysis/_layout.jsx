import { Slot } from "expo-router";
import { StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AnalysisLayout() {
    const router = useRouter();

  return (

    <SafeAreaView style={styles.safeArea}>
    <Header />
    <View style={styles.content}>
      <Slot />
    </View>
    <Footer />
  </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
      },
      safeArea: {
        flex: 1,
      },
      content: {
        flex: 1,
      },
})