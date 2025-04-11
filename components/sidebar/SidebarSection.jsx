import { View, Text, StyleSheet, Pressable } from 'react-native';

export default function SidebarSection({ title, items }) {
  return (
    <View style={styles.section}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.content}>
        {items.map((item, index) => (
          <Pressable 
            key={index} 
            style={[
              styles.item,
              index === items.length - 1 && styles.lastItem
            ]}
            onPress={() => {/* 각 항목 클릭 처리 */}}
          >
            <Text style={styles.icon}>{item.icon}</Text>
            <Text style={styles.label}>{item.label}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1170DF',
    marginBottom: 8,
  },
  content: {
    backgroundColor: '#F5F9FF',
    borderRadius: 12,
    overflow: 'hidden',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  lastItem: {
    borderBottomWidth: 0,
  },
  icon: {
    fontSize: 16,
    marginRight: 12,
  },
  label: {
    fontSize: 14,
    color: '#333',
  },
}); 