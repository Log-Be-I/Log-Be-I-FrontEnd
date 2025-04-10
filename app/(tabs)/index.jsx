import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import ScheduleList from "@/components/schedule/scheduleList";
import { FlatList, Pressable, Text, View } from "react-native";
import ScheduleItem from "@/constants/ScheduleItem";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScheduleList />
    </SafeAreaView>
  );
}
