import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { CATEGORIES, getCategoryById } from "../../constants/CategoryData";

export default function CategoryDropdown({
  value,
  onChange,
  isEditing = true,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedCategory = getCategoryById(value);

  const handlePress = () => {
    if (isEditing) {
      setIsOpen(!isOpen);
    }
  };

  const handleSelect = (categoryId) => {
    onChange(Number(categoryId));
    setIsOpen(false);
  };

  return (
    <View style={styles.container}>
      <Pressable
        style={styles.selectedCategory}
        onPress={handlePress}
        disabled={!isEditing}
      >
        <MaterialCommunityIcons
          name={selectedCategory?.icon}
          size={24}
          color={isEditing ? selectedCategory?.color : "#666666"}
        />
        <Text
          style={[
            styles.categoryText,
            !isEditing && styles.categoryTextDisabled,
          ]}
        >
          {selectedCategory?.name}
        </Text>
        {isEditing && (
          <MaterialCommunityIcons
            name="chevron-down"
            size={20}
            color="#666666"
          />
        )}
      </Pressable>
      {isOpen && isEditing && (
        <View style={styles.dropdownContainer}>
          {CATEGORIES.map((category) => (
            <Pressable
              key={category.categoryId}
              style={styles.dropdownItem}
              onPress={() => handleSelect(category.categoryId)}
            >
              <MaterialCommunityIcons
                name={category.icon}
                size={24}
                color={category.color}
              />
              <Text style={styles.dropdownText}>{category.name}</Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    zIndex: 1,
  },
  selectedCategory: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: "#F5F5F5",
  },
  categoryText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333333",
  },
  categoryTextDisabled: {
    color: "#666666",
  },
  dropdownContainer: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 8,
    marginTop: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 12,
    borderRadius: 8,
  },
  dropdownText: {
    fontSize: 14,
    color: "#333333",
  },
});
