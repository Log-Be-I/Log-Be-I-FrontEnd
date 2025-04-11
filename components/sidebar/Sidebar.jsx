// components/sidebar/Sidebar.jsx
import { View, StyleSheet, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import SidebarHeader from './SidebarHeader';
import SidebarProfile from './SidebarProfile';
import SidebarNavMenu from './SidebarNavMenu';
import SidebarSection from './SidebarSection';
import LogoutIcon from '../../assets/sidebar/logoutIcon.svg';

export default function Sidebar({ onClose }) {
  const router = useRouter();
  
  const handleLogout = () => {
    router.push('/');
  };

  return (
    <View style={styles.container}>
        <View style={styles.sideNavMenuContainer}>
            <SidebarNavMenu />
        </View>
    <View style={styles.content}>
        <View style={styles.header}>
        <SidebarHeader onClose={onClose} />
        <SidebarProfile />
        </View>
    
        <View style={styles.sections}>
        <SidebarSection 
            title="My Record"
            items={[
            { label: '나의 일상', icon: '📅' },
            { label: '나의 소비', icon: '💰' },
            { label: '나의 할 일', icon: '📝' },
            { label: '나의 건강', icon: '❤️' },
            { label: '그 외 등등', icon: '⚙️' },
            ]}
        />

        <SidebarSection 
            title="My Report"
            items={[
            { label: '나의 일상 분석', icon: '📊' },
            ]}
        />

        <SidebarSection 
            title="My Activity"
            items={[
            { label: '오늘의 이슈', icon: '🔍' },
            { label: '나의 QnA', icon: '💭' },
            { label: '자주 하는 질문', icon: '❓' },
            ]}
        />

        <View style={styles.logoutContainer}>
            <View style={styles.logoutDivider} />
            <Pressable style={styles.logoutButton} onPress={handleLogout}>
            <LogoutIcon width={20} height={20} />
            <Text style={styles.logoutText}>Log Out</Text>
            </Pressable>
        </View>
        </View>
    </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    width: '100%',
    backgroundColor: '#fff',
    position: 'relative',
  },
  content: {
    flex: 1,
    marginLeft: 60,
  },
  sideNavMenuContainer: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    width: 60,
    height: 680, // 원하는 높이
    backgroundColor: '#69BAFF',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopRightRadius: 12,
    paddingVertical: 12,
  },
  sections: {
    flex: 1,
    padding: 16,
    paddingTop: 0,
  },
  logoutContainer: {
    paddingTop: 16,
  },
  logoutDivider: {
    height: 1,
    backgroundColor: '#E5E5E5',
    marginBottom: 16,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  logoutText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#666',
  },
});
