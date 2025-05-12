// components/qna/IconComponent.jsx
import { View, StyleSheet } from 'react-native';
import AnswerIcon from '../../assets/qna/answerIcon.svg';
import GirogiIcon from '../../assets/qna/answerGirogi.svg';

export default function IconComponent({ questionAnswerStatus }) {
  console.log("🚀 아이콘 렌더링 상태:", questionAnswerStatus);

  // ✅ 조건을 대문자로 변환하여 비교
  const status = questionAnswerStatus?.trim().toUpperCase();
  if (status !== 'DONE_ANSWER') return null;

  return (
    <View style={styles.iconContainer}>
      <AnswerIcon width="70" height="55" />
      <View style={styles.girogiContainer}>
        <GirogiIcon width="25" height="25" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    position: 'absolute',
    right: 16,
    bottom: -10,
    zIndex: 1,
  },
  girogiContainer: {
    position: 'absolute',
    right: 60,
    bottom: 5,
    zIndex: 1,
  },
});
