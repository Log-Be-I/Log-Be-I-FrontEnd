// components/sidebar/SidebarNavMenu.jsx
import { View, StyleSheet, Pressable } from 'react-native';
import RecordIcon from '../../assets/sidebar/sidebarNav/sideNavIcon.svg';
import WebRTCIcon from '../../assets/sidebar/sidebarNav/webRtcIcon.svg';
import NoticeIcon from '../../assets/sidebar/sidebarNav/noticeIcon.svg';

// 사이드바의 왼쪽 네비게이션 메뉴를 담당하는 컴포넌트
export default function SidebarNavMenu() {
  return (
    <View style={styles.navMenu}>
      {/* 네비게이션 아이콘들 */}
      <View style={styles.iconContainer}>
        <Pressable style={[styles.iconWrapper, styles.activeIcon]}>
          <RecordIcon width={24} height={24} />
          {/* 현재 선택된 메뉴를 가리키는 흰색 포인터 */}
          <View style={styles.pointer} />
        </Pressable>
        
        <Pressable style={styles.iconWrapper}>
          <WebRTCIcon width={24} height={24} />
        </Pressable>
        
        <Pressable style={styles.iconWrapper}>
          <NoticeIcon width={24} height={24} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  navMenu: {
    width: 60,
    backgroundColor: '#69BAFF',
    height: '100%',
    alignItems: 'center',
    paddingVertical: 20,
  },
  iconContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 60, // 아이콘 간격
  },
  iconWrapper: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  pointer: {
    width: 10,
    height: 10,
    backgroundColor: '#fff',
    position: 'absolute',
    right: -15,
    top: 10,
    transform: [{ rotate: '45deg' }], // 45도 회전하여 다이아몬드 모양 생성
    borderRadius: 2,
  },
});
