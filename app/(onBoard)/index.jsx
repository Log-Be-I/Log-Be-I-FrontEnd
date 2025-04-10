import { useRouter } from "expo-router";
import { Pressable, Text, StyleSheet, View} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import GoogleSignin from '../../assets/images/googleLogo.svg';
import LogBeIText from '../../assets/images/logBeIText.svg';
import BackgroundSVG from '../../assets/images/loginPageBackground.svg';
// import * as Google from 'expo-auth-session/providers/google';
// import { useState } from 'react';

export default function Login() {
    const router = useRouter();
    // const [userInfo, setUserInfo] = useState(null);

    // const [request, response, promptAsync] = Google.useAuthRequest({
    //     clientId: 'YOUR_GOOGLE_CLIENT_ID',
    //     // 필요한 경우 추가 설정
    // });

    // const handleGoogleSignIn = async () => {
    //     try {
    //         const result = await promptAsync();
    //         if (result?.type === 'success') {
    //             const { authentication } = result;
    //             // Google API를 통해 사용자 정보 가져오기
    //             const userInfoResponse = await fetch(
    //                 'https://www.googleapis.com/userinfo/v2/me',
    //                 {
    //                     headers: { Authorization: `Bearer ${authentication.accessToken}` },
    //                 }
    //             );
    //             const googleUserInfo = await userInfoResponse.json();
    //             setUserInfo(googleUserInfo);
    //             // 회원가입 페이지로 사용자 정보 전달
    //             router.push({
    //                 pathname: "/signUp",
    //                 params: {
    //                     email: googleUserInfo.email,
    //                     name: googleUserInfo.name
    //                 }
    //             });
    //         }
    //     } catch (error) {
    //         console.error('Google Sign-In Error:', error);
    //     }
    // };

    return (
        <SafeAreaView style={styles.container}>
            <BackgroundSVG style={styles.background} width='100%' height='100%' preserveAspectRatio='none'/>
            <View style={styles.contentContainer}>
                <LogBeIText width={160} height={80} style={styles.logo}/>
                <View style={styles.loginContainer}>
                    <View style={styles.titleContainer}>
                        <Text style={styles.loginText}>Login</Text>
                        <View style={styles.shortLine} />
                    </View>
                    <View style={styles.longLine} />
                    <Pressable style={styles.googleButton} onPress={() => router.push("/signUp") /*handleGoogleSignIn*/}>
                        <View style={styles.googleContent}>
                            <GoogleSignin width={24} height={24} />
                            <Text style={styles.googleButtonText}>Sign In with Google</Text>
                        </View>
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
        bottom: 0,
        zIndex: -1,
    },
    contentContainer: {
        flex: 1,
        padding: 20,
        justifyContent: 'space-between',
    },
    logo: {
        alignSelf: 'center',
        marginTop: 100,
    },
    loginContainer: {
        width: '100%',
        paddingHorizontal: 20,
        marginBottom: 100,
    },
    titleContainer: {
        alignItems: 'flex-start',
    },
    loginText: {
        fontSize: 24,
        fontWeight: '600',
        color: '#1170DF',
        marginBottom: 8,
    },
    shortLine: {
        width: 40,
        height: 3,
        backgroundColor: '#1170DF',
        marginBottom: 16,
    },
    longLine: {
        width: '100%',
        height: 1,
        backgroundColor: '#82ACF1',
        marginBottom: 24,
    },
    googleButton: {
        backgroundColor: '#fff',
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
        padding: 16,
    },
    googleContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: 12,
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
