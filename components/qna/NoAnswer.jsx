import { View, StyleSheet } from 'react-native';
import SpeechBubble from '../../assets/qna/speechBubble.svg';
import FileAgirogi from '../../assets/qna/fileAgirogi.svg';

export default function NoAnswer() {
    return (
        <View style={styles.container}>
            <View style={styles.speechBubbleContainer}>
                <SpeechBubble width={160} height={160} />
            </View>
            <View style={styles.fileAgirogiContainer}>
                <FileAgirogi width={160} height={160} />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        top: 16,
        left: 10,
    },
    speechBubbleContainer: {
        position: 'absolute',
        left: 80,
        zIndex: 100,
    },
    fileAgirogiContainer: {
        position: 'absolute',
        top: 10,
        right: 190,
    },
})
