// components/sidebar/SidebarLogout.jsx
import { View, Pressable, Text, StyleSheet } from 'react-native';

export default function SidebarLogout() {
  const handleLogout = () => {
    console.log('로그아웃 실행');
    // 여기에 실제 로그아웃 처리 로직 삽입
    useUserStore.getState().clearUserInfo();
    // 추가 네비게이션 처리 필요. index로 이동시키자.
  };

  return (
    <View style={styles.logoutContainer}>
      {/* 로그아웃 버튼 */}
      <Pressable onPress={handleLogout} style={styles.logoutBtn}>
        <Text style={styles.logoutText}>🚪 Log Out</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  logoutContainer: {
    marginTop: 30,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    paddingTop: 16,
  },
  logoutBtn: {
    paddingVertical: 10,
  },
  logoutText: {
    fontSize: 14,
    color: '#999',
  },
});
