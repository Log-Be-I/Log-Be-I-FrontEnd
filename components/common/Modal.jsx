import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Button from '../common/button';

const Modal = ({ isOpen, onClose, children, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <View style={styles.overlay}>
      <View style={styles.modalContent}>
        <Text style={styles.modalText}>{children}</Text>
        <View style={styles.buttonContainer}>
          <Button 
            text="YES" 
            onPress={onConfirm} 
            style={[styles.button, styles.yesButton]}
            textStyle={{color: 'white'}}
          />
          <Button 
            text="NO" 
            onPress={onClose} 
            style={[styles.button, styles.noButton]}
            textStyle={{color: 'white'}}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 8,
    width: '80%',
    maxWidth: 400,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalText: {
    marginBottom: 20,
    textAlign: 'center',
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  button: {
    flex: 1,
    padding: 10,
    borderRadius: 4,
  },
  yesButton: {
    backgroundColor: '#69BAFF',
  },
  noButton: {
    backgroundColor: '#FF9500',
  },
});

export default Modal; 