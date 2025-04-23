import { Slot } from "expo-router";
import { StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import Footer from "../../components/common/Footer";
import { SafeAreaView } from "react-native-safe-area-context";

export default function NoticeLayout() {
  const router = useRouter();

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
    <SafeAreaView style={styles.safeArea}>
    <View style={styles.content}>
      <Slot />
    </View>
    <Footer onTabPress={handleTabPress} />
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
});
