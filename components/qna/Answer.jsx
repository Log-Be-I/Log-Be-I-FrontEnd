import { View, Text, StyleSheet, Image } from 'react-native';

export default function Answer({ answer }) {
    const { content, createAt } = answer;

    return (
        <View style={styles.container}>
            <View style={styles.section}>
                <View style={styles.checkContainer}>
                    <Image
                    source={require("../../assets/schedule/check.png")}
                    style={styles.checkIcon}
                    />
                    <Text style={styles.sectionLabel}>답변</Text>
                </View>
            <View style={styles.contentContainer}>
                <Text>{content}</Text>
            </View>
            <Text style={styles.createAt}>{createAt}</Text>
          </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexL: 1,
    },
    section: {
        marginBottom: 24,
      },
      checkContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
      },
      checkIcon: {
        width: 16,
        height: 8,
      },
      sectionLabel: {
        fontSize: 14,
        fontWeight: '500',
        color: '#4B5563',
        marginBottom: 8,
      },
      contentContainer: {
        padding: 16,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        height: 110,
        textAlignVertical: 'top',
      },
      createAt: {
        fontSize: 12,
        color: "#666666",
        textAlign: "right",
        marginTop: 6,
      },
})
