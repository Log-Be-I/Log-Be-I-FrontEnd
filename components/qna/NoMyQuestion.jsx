import { View, Text, Pressable, StyleSheet, FlatList } from 'react-native';
import NoQuestion from '../../assets/qna/noQuestion.svg'
import SaveButton from './SaveButton';

export default function NoMyQuestion() {

  return (
    <View style={styles.container}>

      <View style={styles.iconcontainer}>
        <NoQuestion style={styles.icon} />
        <Text style={styles.text}>질문이 없습니다.</Text>
        <Text style={styles.text}> 궁금한 점에 대해 문의를 남겨주세요</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  iconcontainer: {
    flex: 1,
    paddingTop: 180,
    alignItems: 'center',
  },
  icon: {
    marginBottom: 40,
  },
  text: {
    fontSize: 18,
    fontWeight: '500',
    color: '#032B77',
    marginBottom: 10,
  },
});

