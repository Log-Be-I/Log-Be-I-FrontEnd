// components/sidebar/SidebarNavMenu.jsx
import { View, StyleSheet } from 'react-native';

// 사이드바의 왼쪽 네비게이션 메뉴를 담당하는 컴포넌트
export default function SidebarNavMenu() {
  return (
    <View style={styles.navMenu}>
      {/* 현재 선택된 메뉴를 가리키는 흰색 포인터 */}
      <View style={styles.pointer} />
    </View>
  );
}

const styles = StyleSheet.create({
  navMenu: {
    width: 60,
    backgroundColor: '#69BAFF',
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    zIndex: 1,
  },
  pointer: {
    width: 10,
    height: 10,
    backgroundColor: '#fff',
    position: 'absolute',
    right: -5,
    top: 20,
    transform: [{ rotate: '45deg' }], // 45도 회전하여 다이아몬드 모양 생성
    borderRadius: 2,
  },
});
