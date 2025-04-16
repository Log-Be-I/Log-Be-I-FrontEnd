import { View, StyleSheet } from "react-native";
import { Stack } from "expo-router";
import { useState, useCallback, useEffect } from "react";
import RecordList from "../../../components/record/RecordList";
import RecordDateRange from "../../../components/record/RecordDateRange";
import { RECORDS } from "../../../constants/RecordDummyData";
import { CATEGORIES, CATEGORY_ICONS } from "../../../constants/CategoryData";

export default function RecordScreen() {
  const [selectedDateRange, setSelectedDateRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
  });

  const handleDateRangeChange = (range) => {
    setSelectedDateRange(range);
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "기록",
          headerShown: true,
        }}
      />
      <RecordDateRange onRangeChange={handleDateRangeChange} />
      <RecordList
        records={RECORDS.filter(
          (record) =>
            new Date(record.record_date) >=
              new Date(selectedDateRange.startDate.setHours(0, 0, 0, 0)) &&
            new Date(record.record_date) <=
              new Date(selectedDateRange.endDate.setHours(23, 59, 59, 999))
        )}
        selectedStartDate={selectedDateRange.startDate}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
});
