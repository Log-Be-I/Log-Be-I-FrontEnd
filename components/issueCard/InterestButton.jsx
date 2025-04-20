import React from 'react';
import { Pressable, StyleSheet, View, Text } from 'react-native';

export default function InterestButton({ title, icon, onPress, isSelected }) {
  const isCloseIcon = icon.name === "close-circle-outline";

  return (
    <Pressable 
      style={[
        styles.buttonOuter,
        isSelected && styles.selectedButtonOuter
      ]} 
      onPress={onPress}
    >
      <View style={[
        styles.buttonInner,
        isSelected && styles.selectedButtonInner
      ]}>
        <View style={styles.content}>
          <Text style={[
            styles.text,
            isSelected && styles.selectedText
          ]}>{title}</Text>
          {icon && (
            isCloseIcon ? (
              <View style={styles.closeIconWrapper}>
                <Text style={styles.closeIcon}>{icon}</Text>
            </View>
            ) : (
              <Text style={styles.icon}>{icon}</Text>
            )
          )}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  buttonOuter: {
    width: 140, // 고정된 사이즈
    height: 44,
    borderRadius: 50,
    padding: 2,
    backgroundColor: '#f0f4ff',
    shadowColor: '#B7BFFF',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
    alignSelf: 'center',
  },
  selectedButtonOuter: {
    backgroundColor: '#69BAFF',
  },
  buttonInner: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 50,
    borderWidth: 1,
    borderColor: '#E0E9FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedButtonInner: {
    backgroundColor: '#69BAFF',
    borderColor: '#69BAFF',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6, // RN 0.71+ 지원. 하위 버전이면 marginLeft 사용
  },
  text: {
    color: '#69BAFF',
    fontSize: 15,
    fontWeight: '500',
  },
  selectedText: {
    color: '#fff',
  },
  icon: {
    fontSize: 18,
    marginLeft: 8,
  },
  closeIconWrapper: {
    position: 'absolute',
    right: 10,
    top: '50%',
    transform: [{ translateY: -8 }],
  },
  closeIcon: {
    fontSize: 12,
    color: '#3B5BA9',
  },
});
