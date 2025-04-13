import { View, Text, StyleSheet } from 'react-native';
import SidebarMenuItem from './SidebarMenuItem';

export default function SidebarSection({ title, items, onItemPress, activeItemId }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.menuItemsContainer}>
        {items.map((item, index) => (
          <SidebarMenuItem
            key={item.id}
            icon={item.icon}
            label={item.label}
            onPress={() => onItemPress?.(item.id)}
            isActive={activeItemId === item.id}
            isLast={index === items.length - 1}
          />
        ))}
      </View>
      <View style={styles.divider} />
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 24,
    position: 'relative',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0057FF',
    marginBottom: 12,
    paddingLeft: 4,
  },
  menuItemsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  divider: {
    position: 'absolute',
    bottom: -12,
    left: '5%',
    right: '5%',
    height: 1,
    backgroundColor: 'rgba(105, 186, 255, 0.2)',
  },
}); 