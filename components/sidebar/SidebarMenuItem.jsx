import { View, Text, Pressable, StyleSheet } from 'react-native';

export default function SidebarMenuItem({ icon, label, onPress, isActive, isLast }) {
  return (
    <Pressable 
      style={[
        styles.menuItem,
        isActive && styles.activeMenuItem,
        !isLast && styles.borderBottom
      ]} 
      onPress={onPress}
    >
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Text style={styles.iconText}>{icon}</Text>
        </View>
        <Text style={[styles.label, isActive && styles.activeLabel]}>{label}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  menuItem: {
    backgroundColor: '#FFFFFF',
    width: '100%',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  activeMenuItem: {
    backgroundColor: '#F5F9FF',
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: '#FFFFFF',
  },
  iconContainer: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  iconText: {
    fontSize: 16,
  },
  label: {
    fontSize: 14,
    color: '#333333',
    fontWeight: '400',
  },
  activeLabel: {
    color: '#0057FF',
    fontWeight: '500',
  },
}); 