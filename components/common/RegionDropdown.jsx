import { View, Text, Pressable, ScrollView, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useState } from "react";
import LocationIcon from "../../assets/sidebar/sidebarProfile/locationIcon.svg";
import { CityData } from "../../constants/CityData";

export const RegionDropdown = ({
  selectedCity, 
  setSelectedCity, 
  selectedDistrict, 
  setSelectedDistrict 
}) => {
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [showDistrictDropdown, setShowDistrictDropdown] = useState(false);

  const handleCitySelect = (city) => {
    setSelectedCity(city); // 부모 state 업데이트
    setSelectedDistrict(""); // 구 초기화
    setShowCityDropdown(false);
  };

  const handleDistrictSelect = (district) => {
    setSelectedDistrict(district);
    setShowDistrictDropdown(false);

    // if (handleValue) {
    //   handleValue(`${selectedCity} ${district}`);
    // }
  };

  const DropdownItem = ({
    value,
    items,
    isOpen,
    onPress,
    onSelect,
    disabled = false,
    leftIcon = null,
    defaultText,
  }) => {
    return (
      <View style={styles.container}>
        <Pressable
          style={[styles.button, disabled && styles.buttonDisabled]}
          onPress={onPress}
          disabled={disabled}
        >
          {leftIcon}
          <Text style={[styles.buttonText, !value && styles.placeholder]}>
            {value || defaultText}
          </Text>
          <Icon name="chevron-down" size={20} color="#ABB7D0" />
        </Pressable>

        {isOpen && (
          <View style={styles.dropdownContainer}>
            <ScrollView
              style={styles.dropdownScroll}
              showsVerticalScrollIndicator={true}
              nestedScrollEnabled={true}
            >
              {items.map((item) => (
                <Pressable
                  key={item}
                  style={[styles.item, value === item && styles.selectedItem]}
                  onPress={() => onSelect(item)}
                >
                  <Text
                    style={[
                      styles.itemText,
                      value === item && styles.selectedItemText,
                    ]}
                  >
                    {item}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.regionContainer}>
      <View style={styles.regionItem}>
        <DropdownItem
          value={selectedCity}
          items={Object.keys(CityData)}
          isOpen={showCityDropdown}
          onPress={() => {
            setShowCityDropdown(!showCityDropdown);
            setShowDistrictDropdown(false);
          }}
          onSelect={handleCitySelect}
          leftIcon={<LocationIcon width={20} height={20} />}
          defaultText="시"
        />
      </View>
      <View style={styles.regionItem}>
        <DropdownItem
          value={selectedDistrict}
          items={selectedCity ? CityData[selectedCity] : []}
          isOpen={showDistrictDropdown}
          onPress={() => {
            if (selectedCity) {
              setShowDistrictDropdown(!showDistrictDropdown);
              setShowCityDropdown(false);
            }
          }}
          onSelect={handleDistrictSelect}
          disabled={!selectedCity}
          defaultText="구/군"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  regionContainer: {
    flexDirection: "row",
    gap: 12,
  },
  regionItem: {
    flex: 1,
  },
  container: {
    position: "relative",
  },
  button: {
    height: 48,
    backgroundColor: "#FFFFFF",
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#F0F4FA",
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    flex: 1,
    fontSize: 14,
    color: "#032B77",
    marginLeft: 8,
  },
  placeholder: {
    color: "#ABB7D0",
  },
  dropdownContainer: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#F0F4FA",
    marginTop: 4,
    maxHeight: 150,
    zIndex: 100,
  },
  dropdownScroll: {
    paddingVertical: 4,
  },
  item: {
    height: 48,
    paddingHorizontal: 16,
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F0F4FA",
  },
  selectedItem: {
    backgroundColor: "#F7FAFF",
  },
  itemText: {
    fontSize: 14,
    color: "#032B77",
  },
  selectedItemText: {
    color: "#69BAFF",
    fontWeight: "600",
  },
});
