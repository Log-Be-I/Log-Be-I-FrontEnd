import React from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const SearchInput = ({ value, onChangeText, onRegister }) => {
  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Icon name="search-outline" size={24} color="#666" style={styles.searchIcon} />
        <View style={styles.divider} />
        <TextInput
          style={styles.input}
          placeholder="관심 있는 주제를 1개씩 입력해보세요"
          value={value}
          onChangeText={onChangeText}
        />
      </View>
      <TouchableOpacity style={styles.registerButton} onPress={onRegister}>
        <Text style={styles.registerText}>등록</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginVertical: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  searchIcon: {
    marginRight: 10,
  },
  divider: {
    width: 1,
    height: '80%',
    backgroundColor: '#ddd',
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  registerButton: {
    alignSelf: 'flex-end',
    backgroundColor: '#69BAFF',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 5,
    marginTop: 10,
  },
  registerText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default SearchInput; 