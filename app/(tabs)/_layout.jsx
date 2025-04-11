import { Tabs } from 'expo-router';
import React, { useState, useRef, useEffect } from 'react';
import { Platform, View, StyleSheet, Modal, Animated } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import Footer from '../../components/common/Footer';
import Sidebar from '../../components/sidebar/Sidebar';
import { Slot } from 'expo-router';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const [currentTab, setCurrentTab] = useState('index');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const slideAnim = useRef(new Animated.Value(-100)).current;

  const handleTabPress = (tabName) => {
    setCurrentTab(tabName);
  };

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: isSidebarOpen ? 0 : -100,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isSidebarOpen]);

  return (
    <View style={styles.container}>
      {isSidebarOpen && (
        <Animated.View
          style={[
            styles.sidebarContainer,
            {
              transform: [
                {
                  translateX: slideAnim.interpolate({
                    inputRange: [-100, 0],
                    outputRange: ['-100%', '0%'],
                  }),
                },
              ],
            },
          ]}
        >
          <Sidebar onClose={() => setIsSidebarOpen(false)} />
        </Animated.View>
      )}

      <Slot />
      
      <Footer 
        currentTab={currentTab} 
        onTabPress={handleTabPress}
        onMenuPress={() => setIsSidebarOpen(true)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  sidebarContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: '100%',
    zIndex: 1000,
  },
});
