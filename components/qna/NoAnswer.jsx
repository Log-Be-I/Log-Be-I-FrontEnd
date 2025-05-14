import { View, StyleSheet } from 'react-native';
import SpeechBubble from '../../assets/qna/speechBubble.svg';
import FileAgirogi from '../../assets/qna/fileAgirogi.svg';

export default function NoAnswer() {
    return (
        <View style={styles.container}>
            <View style={styles.fileAgirogiContainer}>
                <FileAgirogi width={160} height={160} />
            </View>
            <View style={styles.speechBubbleContainer}>
                <SpeechBubble width={160} height={160} />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'flex-end',
        paddingRight: 20,
        marginBottom: 40,
    },
    fileAgirogiContainer: {
        justifyContent: 'flex-end',
    },
    speechBubbleContainer: {
        alignItems: 'flex-end',
        marginBottom: 40,
    },
})
