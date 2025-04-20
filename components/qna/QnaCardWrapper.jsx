// components/qna/QnaCardWithIcon.jsx
import { View, StyleSheet, Pressable } from 'react-native';
import QnaCard from './QnaCard';
import IconComponent from './IconComponent';

export default function QnaCardWrapper({ title, createAt, status, onPress }) {
  return (
    <Pressable onPress={onPress}>
      <View style={styles.wrapper}>
        <QnaCard title={title} createAt={createAt} />
        <IconComponent status={status} />
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
