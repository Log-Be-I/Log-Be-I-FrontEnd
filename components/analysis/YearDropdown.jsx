import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Modal, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export default function YearDropdown({ selectedYear, onSelect }) {
  const [isOpen, setIsOpen] = useState(false);
  const years = Array.from({ length: 8 }, (_, i) => 2025 - i);

  return (
    <View style={styles.container}>
      <Pressable style={styles.button} onPress={() => setIsOpen(true)}>
        <Text style={styles.buttonText}>{selectedYear}년</Text>
        <Icon name="chevron-down" size={20} color="#000" />
      </Pressable>

      <Modal
        visible={isOpen}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <Pressable 
          style={styles.modalOverlay}
          onPress={() => setIsOpen(false)}
        >
          <View style={styles.modalContent}>
            <ScrollView>
                {years.map((year) => (
                <Pressable
                    key={year}
                    style={[
                    styles.yearItem,
                    selectedYear === year && styles.selectedYear,
                    ]}
                    onPress={() => {
                    onSelect(year);
                    setIsOpen(false);
                    }}
                >
                    <Text style={[
                    styles.yearText,
                    selectedYear === year && styles.selectedYearText,
                    ]}>{year}년</Text>
                </Pressable>
                ))}
            </ScrollView>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '25%',
    left: 15,
    marginTop: 10,
    marginBottom: 10,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    backgroundColor: '#fff',
    gap: 8,
  },
  buttonText: {
    fontSize: 16,
    color: '#1F2937',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    maxHeight: '80%',
    maxHeight: 60 *5
  },
  yearItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  selectedYear: {
    backgroundColor: '#69BAFF20',
  },
  yearText: {
    fontSize: 16,
    color: '#1F2937',
  },
  selectedYearText: {
    color: '#69BAFF',
    fontWeight: '600',
  },
}); 