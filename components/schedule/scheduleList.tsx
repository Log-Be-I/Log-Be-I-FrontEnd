import { useRouter } from "expo-router";
import { FlatList, Pressable, Text, View } from "react-native";
import ScheduleItem from "@/constants/ScheduleItem";

const ScheduleList = () => {
  const router = useRouter();

  const data = ScheduleItem;

  return (
    <View style={{ height: 500 }}>
      <FlatList
        data={data}
        stickyHeaderIndices={[0]}
        ListHeaderComponent={() => (
          <View style={{ backgroundColor: "#FFFFFF" }}>
            <Text>Gㅎㅇㅇ</Text>
          </View>
        )}
        ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
        renderItem={({ item }) => (
          <Pressable onPress={() => router.push(`/schedule/${item.id}`)}>
            <View style={{ flexDirection: "column" }}>
              <Text>{item.title}</Text>
              <Text>{item.description}</Text>
            </View>
            <Text>
              - {item.startTime} To {item.endTime}
            </Text>
          </Pressable>
        )}
      />
    </View>
  );
};

export default ScheduleList;
