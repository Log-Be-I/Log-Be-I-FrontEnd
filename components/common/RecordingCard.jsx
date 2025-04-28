import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated, TouchableOpacity } from "react-native";
import Text from "./Text"; // 커스텀 Text

export default function RecordingCard({ onStop }) {
  const animation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animation, {
          toValue: 1,
          duration: 500,
          useNativeDriver: false,
        }),
        Animated.timing(animation, {
          toValue: 0,
          duration: 500,
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, []);

  const waveWidth = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [20, 100],
  });

  return (
    <View style={styles.overlay}>
      <View style={styles.card}>
        <Text variant="bold" size={20} color="#000" style={styles.title}>
          Voice
        </Text>

        <Animated.View style={[styles.wave, { width: waveWidth }]} />

        <TouchableOpacity style={styles.stopButton} onPress={onStop}>
          <View style={styles.stopIcon} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    bottom: 80,
    left: 20,
    right: 20,
    alignItems: "center",
  },
  card: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    alignItems: "center",
  },
  title: {
    marginBottom: 10,
  },
  wave: {
    height: 10,
    backgroundColor: "#69BAFF",
    borderRadius: 5,
    marginVertical: 20,
  },
  stopButton: {
    marginTop: 10,
    backgroundColor: "#FF4C4C",
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  stopIcon: {
    width: 24,
    height: 24,
    backgroundColor: "white",
  },
});
