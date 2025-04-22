// components/qna/QnaCardWithIcon.jsx
import { View, StyleSheet, Pressable } from 'react-native';
import QnaCard from './QnaCard';
import IconComponent from './IconComponent';

export default function QnaCardWrapper({ title, createdAt, questionAnswerStatus, onPress }) {
  return (
    <Pressable onPress={onPress}>
      <View style={styles.wrapper}>
        <QnaCard title={title} createdAt={createdAt} />
        <IconComponent questionAnswerStatus={questionAnswerStatus} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
    overflow: 'visible',
  },
});
