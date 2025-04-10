// components/common/Header.jsx
import { View, Pressable, StyleSheet } from 'react-native';
import LogBeIText from '../../assets/images/logBeIText.svg'; // 로고 SVG
import MenuIcon from '../../assets/images/menuIconHeader.svg'; // 메뉴 SVG

export default function Header({ onMenuPress }) {
  return (
    <View style={styles.headerContainer}>
      <View style={styles.logoContainer}>
        <LogBeIText width={88} height={45} />
      </View>

      {/* 오른쪽 메뉴 아이콘 (누르면 onMenuPress 실행) */}
      <Pressable onPress={onMenuPress} style={styles.menuIconContainer}>
        <MenuIcon width={21} height={16} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
    headerContainer: {
      width: '100%',
      paddingHorizontal: 20,      // 좌우 여백
      paddingTop: 20,             // 위 여백
      paddingBottom: 12,          // 아래 여백
      flexDirection: 'row',       // 가로로 정렬
      justifyContent: 'space-between', // 좌/우 끝으로 정렬
      alignItems: 'center',       // 세로 중앙 정렬
    },
    logoContainer: {
        position: 'absolute',
        left: 0,
        right: 0,
        alignItems: 'center',
    },
    menuIconContainer: {
        position: 'absolute',
        right: 20,
    },
  });
