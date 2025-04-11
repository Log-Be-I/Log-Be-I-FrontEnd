import { useState } from 'react';
import { View, Pressable, StyleSheet, Modal, BackHandler } from 'react-native';
import LogBeIText from '../../assets/images/logBeIText.svg'; // 로고 SVG
import MenuIcon from '../../assets/images/menuIconHeader.svg'; // 메뉴 SVG
import Sidebar from '../sidebar/Sidebar';

export default function Header() {
  // const navigation = useNavigation(); //뒤로가기용
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const openSidebar = () => {
    setIsSidebarOpen(true);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

    // // 📱 Android 백버튼으로 사이드바 닫기
    // useEffect(() => {
    //   const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
    //     if (isSidebarOpen) {
    //       closeSidebar();
    //       return true; // 이벤트 소비
    //     }
    //     return false; // 기본 동작 (앱 종료 등)
    //   });
  
    //   return () => backHandler.remove(); // cleanup
    // }, [isSidebarOpen]);

  return (
    <>
      <View style={styles.headerContainer}>
        <View style={styles.logoContainer}>
          <LogBeIText width={88} height={45} />
        </View>

        {/* 오른쪽 메뉴 아이콘 (누르면 onMenuPress 실행) */}
        <Pressable onPress={openSidebar} style={styles.menuIconContainer}>
          <MenuIcon width={21} height={16} />
        </Pressable>
      </View>

      <Modal
      visible={isSidebarOpen}
      animationType="slide"
      transparent={true}
      onRequestClose={closeSidebar} // Android back 대응
    >
      <Sidebar closeSidebar={closeSidebar} />
    </Modal>
  </>
    
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
