import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import TextComponent from "../../components/onBoard/text";
import LogBeIText from "../../assets/images/logBeIText.svg";
import BackgroundSVG from "../../assets/images/loginPageBackground.svg";
import BirthInput from "../../components/common/BirthInput";
import { RegionDropdown } from "../../components/common/RegionDropdown";
import { useMemberStore, useSignUpStore } from "../../zustand/stores/member";
import { axiosWithoutToken } from "../../api/axios/axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SignUp = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const { signUpState, setSignUpState } = useSignUpStore();
  const { setMember } = useMemberStore();

  const handleSignUp = async () => {
    setIsLoading(true);
    try {
      // 필수 필드 검증
      if (
        !signUpState.email ||
        !signUpState.name ||
        !signUpState.nickname ||
        !signUpState.region ||
        !signUpState.birth
      ) {
        console.error("❌ 모든 필드를 입력해주세요.");
        return;
      }

      // 닉네임 유효성 검사 (한글과 영어 소문자만, 2-8자)
      const nicknameRegex = /^[가-힣a-zA-Z]{2,8}$/;
      if (!nicknameRegex.test(signUpState.nickname)) {
        console.error(
          "❌ 닉네임은 2 ~ 8자의 한글 또는 영어 소문자만 가능합니다."
        );
        return;
      }

      // 생년월일 유효성 검사 (YYYY-MM-DD 형식)
      const birthRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!birthRegex.test(signUpState.birth)) {
        console.error("❌ 생년월일은 YYYY-MM-DD 형식이어야 합니다.");
        return;
      }

      console.log("signUpState: ", signUpState);

      const signUpResult = await axiosWithoutToken.post(
        "/members",
        signUpState
      );

      console.log("signUpResult.headers: ", signUpResult.headers);
      console.log(
        "signUpResult.headers.authorization: ",
        signUpResult.headers.authorization
      );

      console.log("signUpResult.data: ", signUpResult.data);

      if (signUpResult.status === 201) {
        console.log("✅ Sign up successful, navigating to main screen");
        setMember({
          memberId: signUpResult.data.memberId,
          name: signUpResult.data.name,
          nickname: signUpResult.data.nickname,
          email: signUpResult.data.email,
          region: signUpResult.data.region,
          birth: signUpResult.data.birth,
          profile: signUpResult.data.profile,
          notification: signUpResult.data.notification,
          memberStatus: signUpResult.data.memberStatus,
          lastLoginAt: signUpResult.data.lastLoginAt,
        });

        await Promise.all([
          AsyncStorage.setItem(
            "accessToken",
            signUpResult.headers.authorization
          ),
          // AsyncStorage.setItem(
          //   "refreshToken",
          //   signUpResult.headers["set-cookie"]
          // ),
        ]);
        router.replace("/(tabs)");
      } else {
        console.error("❌ Sign up failed:", signUpResult.error);
      }
    } catch (error) {
      console.error("❌ Sign up error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // useEffect 제거 - 초기 상태에서 이미 params를 설정했기 때문에 필요 없음
  useEffect(() => {
    console.log(signUpState);
  }, [signUpState]);

  return (
    <SafeAreaView style={styles.container}>
      <BackgroundSVG style={styles.background} />
      <View style={styles.contentContainer}>
        <View>
          <LogBeIText width={160} height={80} style={styles.logo} />
          <Text style={styles.title}>Register</Text>
          <View style={styles.shortLine} />

          <View style={styles.inputContainer}>
            <TextComponent
              value={signUpState.email}
              handleValue={(text) => setSignUpState({ email: text })}
              iconName="person"
              placeholder="이메일"
              editable={!params.email}
            />
            <TextComponent
              value={signUpState.name}
              handleValue={(text) => setSignUpState({ name: text })}
              iconName="mail"
              placeholder="이름"
              editable={!params.name}
            />
            <TextComponent
              value={signUpState.nickname}
              handleValue={(text) => setSignUpState({ nickname: text })}
              iconName="person-outline"
              placeholder="닉네임을 입력해주세요. (2-8자의 한글/영어 소문자)"
            />
            <BirthInput
              value={signUpState.birth}
              handleValue={(text) => setSignUpState({ birth: text })}
              placeholder="1999-12-21"
            />
            <RegionDropdown
              value={signUpState.region}
              handleValue={(text) => setSignUpState({ region: text })}
              iconName="pin-outline"
              placeholder="서울특별시"
            />
          </View>
        </View>

        <Pressable
          style={[styles.button, isLoading && styles.disabledButton]}
          onPress={handleSignUp}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>
            {isLoading ? "Registering..." : "Register"}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  background: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
  },
  contentContainer: {
    flex: 1,
    padding: 20,
    justifyContent: "space-between",
  },
  logo: {
    alignSelf: "center",
    marginTop: 40,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: "#2D64E6",
    marginBottom: 8,
  },
  shortLine: {
    width: 40,
    height: 3,
    backgroundColor: "#1170DF",
    marginBottom: 16,
  },
  inputContainer: {
    gap: 20,
  },
  button: {
    backgroundColor: "#4285F4",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 20,
  },
  disabledButton: {
    backgroundColor: "#cccccc",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default SignUp;

{
  /* <DateTimePicker
    isVisible={isDateTimePickerOpen}
    mode="date"
    onCancel={() => setIsDateTimePickerOpen(false)}
  /> */
}
