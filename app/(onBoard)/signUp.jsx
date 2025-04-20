import { View, StyleSheet, Text } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import TextComponent from "../../components/onBoard/text";
import Button from "../../components/common/button";
import { useState, useEffect } from "react";
import LogBeIText from "../../assets/images/logBeIText.svg";
import BackgroundSVG from "../../assets/images/loginPageBackground.svg";
import BirthInput from "../../components/common/BirthInput";
import { RegionDropdown } from "../../components/common/RegionDropdown";
import { postMember } from "../../api/member/memberApi";

export default function SignUp() {
  const router = useRouter();
  const params = useLocalSearchParams();
  // const [name, setName] = useState("");
  // const [email, setEmail] = useState("");
  const [birth, setBirth] = useState("");
  const [nickname, setNickname] = useState("");
  const [region, setRegion] = useState("");

  const handleRegister = async () => {
    try {
      const token = await postMember({
        email: params.email,
        name: params.name,
        nickname,
        birth,
        region,
      });

      if (token) {
        console.log("회원 등록 성공");
        router.push("/(tabs)");
      } else {
        console.error("회원 등록 실패");
      }
    } catch (error) {
      console.error("회원 등록 오류", error);
    }
  };


  useEffect(() => {
    if (params.name) setName(params.name);
    if (params.email) setEmail(params.email);
  }, [params]);

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
              handleValue={(e) => setName(e)}
              iconName="person"
              placeholder={params.name}
              editable={false}
            />
            <TextComponent
              handleValue={(e) => setEmail(e)}
              iconName="mail"
              placeholder={params.email}
              editable={false}
            />
            <TextComponent
              value={nickname}
              handleValue={(e) => setNickname(e)}
              iconName="person-outline"
              placeholder="닉네임을 입력하세요"
            />
            <BirthInput
              value={birth}
              setValue={setBirth}
              placeholder="1999-12-21"
            />
            <RegionDropdown
              placeholder="서울특별시"
            />
          </View>
        </View>

        <Button
          text="Register"
          size="large"
          onPress={() => /*handleRegister()*/ router.push("/(tabs)")}
        />
      </View>
    </SafeAreaView>
  );
}

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
});

{
  /* <DateTimePicker
    isVisible={isDateTimePickerOpen}
    mode="date"
    onCancel={() => setIsDateTimePickerOpen(false)}
  /> */
}
