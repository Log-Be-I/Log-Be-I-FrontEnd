import { useRouter } from "expo-router";
import { Pressable, Text, StyleSheet, View} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import GoogleSignin from '../../assets/images/googleLogo.svg';
import LogBeIText from '../../assets/images/logBeIText.svg';

export default function Login() {
    const router = useRouter();

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.background} />
            <View style={styles.contentContainer}>
                <LogBeIText width={100} height={100} sytle={styles.textLogo}/>
                <View style={styles.loginContainer}>
                    <Text style={styles.loginText}>Login</Text>
                    <Pressable style={styles.googleButton} onPress={() => router.push("/signUp")}>
                        <GoogleSignin width={24} height={24} />
                        <Text style={styles.googleButtonText}>Sign In with Google</Text>
                    </Pressable>
                </View>
                <View style={styles.footer}>
                    <Text style={styles.footerText}>이용약관 • 개인정보처리방침</Text>
                    <Text style={styles.copyrightText}>Copyright © Log Be I All rights reserved</Text>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    background: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '60%',
        backgroundColor: '#E8F1FF',
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },
    contentContainer: {
        flex: 1,
        padding: 20,
        justifyContent: 'space-between',
    },
    // textLogo: {
    //     marginTop: 60,
    //     marginBottom: 30,
    //     width: 200,
    //     height: 200,
    //   },
    loginContainer: {
        width: '100%',
        alignItems: 'center',
    },
    loginText: {
        fontSize: 24,
        color: '#000',
        marginBottom: 20,
    },
    googleButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 12,
        borderRadius: 8,
        width: '100%',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    googleButtonText: {
        fontSize: 16,
        color: '#666',
    },
    footer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    footerText: {
        fontSize: 12,
        color: '#666',
        marginBottom: 4,
    },
    copyrightText: {
        fontSize: 12,
        color: '#666',
    },
});


// StyleSheet는 SafeAreaView와 무관하다.
// SafeAreaView는 UI 컴포넌트 배치를 위한 영역이고, Style Sheet는 스타일을 적용하기 위한 영역이다.