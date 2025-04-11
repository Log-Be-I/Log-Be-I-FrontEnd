import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";

export default function ScheduleDetail() {
  const { id } = useLocalSearchParams();

  const idNum = Number(id);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Header />
      <Text>{id}</Text>
        <Footer currentTab='home' onTabPress={(tabName) => console.log('선택된 탭:',tabName)} />
    </SafeAreaView>
  );
}
