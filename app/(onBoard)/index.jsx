import { useRouter } from "expo-router";
import { Pressable, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Login() {
    const router= useRouter();


    return (
        <SafeAreaView>
            <Text>로그인</Text>
            <Pressable onPress={() => router.push("/signUp")}><Text>Sign</Text></Pressable>
        </SafeAreaView>
    )
}