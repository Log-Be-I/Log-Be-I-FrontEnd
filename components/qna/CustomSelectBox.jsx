import { useState, useRef } from 'react';
import { View, Text, Pressable, StyleSheet, FlatList, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export default function CustomSelectBox({ selected, setSelected, options }) {
  const [visible, setVisible] = useState(false);

  const selectedLabel = options.find(item => item.key === selected)?.value || '';

  return (
    <View style={styles.wrapper}>
      <Pressable onPress={() => setVisible(!visible)} style={styles.selectBox}>
        <Text style={styles.selectText}>{selectedLabel}</Text>
        <Icon name="chevron-down" size={18} color="#374151" style={styles.icon} />
      </Pressable>

      {visible && (
        <View style={styles.dropdown}>
          {options.map((item) => (
            <Pressable
              key={item.key}
              style={styles.dropdownItem}
              onPress={() => {
                setSelected(item.key);
                setVisible(false);
              }}
            >
              <Text style={styles.dropdownItemText}>{item.value}</Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
    wrapper: {
      position: 'relative',
      alignSelf: 'flex-end',
      zIndex: 10,
    },
    selectBox: {
      width: 100,
      height: 38,
      borderRadius: 8,
      borderColor: '#D1D5DB',
      borderWidth: 1,
      backgroundColor: '#FFFFFF',
      paddingHorizontal: 10,
      flexDirection: 'row',
      alignItems: 'center',
      //justifyContent: 'space-between',
      shadowColor: '#000',
      shadowOpacity: 0.05,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 4,
      elevation: 2,
    },
    selectText: {
      fontSize: 12,
      color: '#374151',
      marginLeft: 8,
    },
    icon: {
      position: 'absolute',
      right: 10,
      top: '50%',
      transform: [{ translateY: -9 }],      
    },
    dropdown: {
      position: 'absolute',
      top: 45,
      right: 0,
      width: 110,
      backgroundColor: '#fff',
      borderRadius: 8,
      borderColor: '#E5E7EB',
      borderWidth: 1,
      paddingVertical: 4,
      shadowColor: '#000',
      shadowOpacity: 0.05,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 4,
      elevation: 3,
    },
    dropdownItem: {
      paddingVertical: 8,
      paddingHorizontal: 12,
    },
    dropdownItemText: {
      fontSize: 12,
      color: '#374151',
    },
  });
  
