import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TextInput, Pressable } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import TextComponent from "../../components/onBoard/text";
import LogBeIText from "../../assets/images/logBeIText.svg";
import BirthIcon from "../../assets/images/birthDay.svg";
import BackgroundSVG from "../../assets/images/loginPageBackground.svg";
import useAuthStore from "../../zustand/stores/authStore";

const SignUp = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { signUp, isLoading } = useAuthStore();

  // 초기 상태를 params로 설정
  const [formData, setFormData] = useState({
    email: params.email || "",
    name: params.name || "",
    nickname: "",
    region: "",
    birth: "",
  });

  const handleSignUp = async () => {
    try {
      // 필수 필드 검증
      if (
        !formData.email ||
        !formData.name ||
        !formData.nickname ||
        !formData.region ||
        !formData.birth
      ) {
        console.error("❌ 모든 필드를 입력해주세요.");
        return;
      }

      // 닉네임 유효성 검사 (한글과 영어 소문자만, 2-8자)
      const nicknameRegex = /^[가-힣a-z]{2,8}$/;
      if (!nicknameRegex.test(formData.nickname)) {
        console.error(
          "❌ 닉네임은 2 ~ 8자의 한글 또는 영어 소문자만 가능합니다."
        );
        return;
      }

      // 생년월일 유효성 검사 (YYYY-MM-DD 형식)
      const birthRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!birthRegex.test(formData.birth)) {
        console.error("❌ 생년월일은 YYYY-MM-DD 형식이어야 합니다.");
        return;
      }

      const signUpResult = await signUp(formData);
      if (signUpResult.success) {
        console.log("✅ Sign up successful, navigating to main screen");
        router.replace("/(tabs)");
      } else {
        console.error("❌ Sign up failed:", signUpResult.error);
      }
    } catch (error) {
      console.error("❌ Sign up error:", error);
    }
  };

  // useEffect 제거 - 초기 상태에서 이미 params를 설정했기 때문에 필요 없음

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
              value={formData.email}
              handleValue={(text) =>
                setFormData((prev) => ({ ...prev, email: text }))
              }
              iconName="person"
              placeholder="이메일"
              editable={!params.email}
            />
            <TextComponent
              value={formData.name}
              handleValue={(text) =>
                setFormData((prev) => ({ ...prev, name: text }))
              }
              iconName="mail"
              placeholder="이름"
              editable={!params.name}
            />
            <TextComponent
              value={formData.nickname}
              handleValue={(text) =>
                setFormData((prev) => ({ ...prev, nickname: text }))
              }
              iconName="person-outline"
              placeholder="닉네임을 입력해주세요. (2-8자의 한글/영어 소문자)"
            />
            <TextComponent
              value={formData.birth}
              handleValue={(text) =>
                setFormData((prev) => ({ ...prev, birth: text }))
              }
              iconComponent={<BirthIcon width={20} height={20} />}
              placeholder="생년월일을 입력해주세요요 (YYYY-MM-DD)"
            />
            <TextComponent
              value={formData.region}
              handleValue={(text) =>
                setFormData((prev) => ({ ...prev, region: text }))
              }
              iconName="pin-outline"
              placeholder="지역을 선택해주세요."
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
    marginTop: 100,
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
