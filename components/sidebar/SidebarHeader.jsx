import { useState } from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import LogBeIText from '../../assets/images/logBeIText.svg'; // 로고 SVG
import BackButton from '../../assets/sidebar/backIconSide.svg'; // 뒤로가기 SVG
import NotificationIcon from '../../assets/sidebar/notificationIconSide.svg'; // 알림 아이콘 SVG

export default function SidebarHeader({ onClose }) {
  return (
    <View style={styles.headerContainer}>
      {/* 뒤로가기 버튼 - 클릭 시 사이드바 닫기 */}
      <Pressable onPress={onClose} style={styles.leftIcon}>
        <BackButton width={21} height={16} />
      </Pressable>

      {/* 중앙 로고 */}
      <View style={styles.centerLogo}>
        <LogBeIText width={88} height={45} />
      </View>

      {/* 알림 아이콘 */}
      <Pressable style={styles.rightIcon}>
        <NotificationIcon width={21} height={16} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
    headerContainer: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#fff',
      },
      leftIcon: {
        width: 40,
        alignItems: 'flex-start',
      },
      centerLogo: {
        flex: 1,
        alignItems: 'center',
      },
      rightIcon: {
        width: 40,
        alignItems: 'flex-end',
      },
});
