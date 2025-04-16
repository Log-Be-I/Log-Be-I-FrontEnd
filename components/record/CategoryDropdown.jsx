import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { CATEGORIES, CATEGORY_ICONS } from "../../constants/CategoryData";

export default function CategoryDropdown({ value, onChange, isEditing }) {
  const [open, setOpen] = useState(false);
  const [items] = useState(
    CATEGORIES.map((category) => ({
      label: category.name,
      value: category.category_id,
      icon: () => (
        <MaterialCommunityIcons
          name={CATEGORY_ICONS[category.name].name}
          size={24}
          color={CATEGORY_ICONS[category.name].color}
        />
      ),
    }))
  );

  if (!isEditing) {
    const category = CATEGORIES.find((cat) => cat.category_id === value);
    return (
      <View style={styles.container}>
        <MaterialCommunityIcons
          name={CATEGORY_ICONS[category.name].name}
          size={24}
          color={CATEGORY_ICONS[category.name].color}
        />
        <Text style={styles.categoryText}>{category.name}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <DropDownPicker
        open={open}
        value={value}
        items={items}
        setOpen={setOpen}
        setValue={onChange}
        style={styles.dropdown}
        dropDownContainerStyle={styles.dropDownContainer}
        textStyle={styles.dropdownText}
        placeholder="카테고리 선택"
        listMode="SCROLLVIEW"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    zIndex: 1000,
  },
  dropdown: {
    backgroundColor: "#F5F5F5",
    borderWidth: 0,
    borderRadius: 8,
    minHeight: 40,
  },
  dropDownContainer: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dropdownText: {
    fontSize: 14,
    color: "#333333",
  },
  categoryText: {
    fontSize: 14,
    color: "#333333",
    marginLeft: 8,
  },
});
