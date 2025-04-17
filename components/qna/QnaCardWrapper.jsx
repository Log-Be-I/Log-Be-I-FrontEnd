// components/qna/QnaCardWithIcon.jsx
import { View, StyleSheet } from 'react-native';
import QnaCard from './QnaCard';
import IconComponent from './IconComponent';

export default function QnaCardWrapper({ title, createAt, status }) {
  return (
    <View style={styles.wrapper}>
      <QnaCard title={title} createAt={createAt} />
      <IconComponent status={status} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
    overflow: 'visible',
    marginBottom: 8,
  },
});
