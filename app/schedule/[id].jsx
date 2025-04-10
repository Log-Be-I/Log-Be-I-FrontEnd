import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../components/common/Header";
export default function ScheduleDetail() {
  const { id } = useLocalSearchParams();

  const idNum = Number(id);

  return (
    <SafeAreaView>
      <Header />
      <Text>{id}</Text>
    </SafeAreaView>
  );
}
