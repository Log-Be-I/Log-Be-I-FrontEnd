import { View, Text, StyleSheet } from 'react-native'; 

export default function QnaCard({ title, createAt, status }) {
  return (
    <View style={styles.container}>
      <Text style={styles.date}>{createAt}</Text>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'visible',
  },
  date: {
    fontSize: 12,
    color: '#666',
    textAlign: 'right',
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
}); 