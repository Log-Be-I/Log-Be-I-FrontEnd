import { Image, Pressable, Text } from "react-native";
import { useRouter } from "expo-router";

import { SafeAreaView } from "react-native-safe-area-context";
import TextComponent from "../../components/onBoard/text";
import { useState } from "react";
// import DateTimePicker from "react-native-modal-datetime-picker"

export default function SignUp() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [birth, setBirth] = useState("");

  // const [isDateTimePickerOpen, setIsDateTimePickerOpen] = useState(false);

  return (
    <SafeAreaView>
      <Text>회원가입</Text>
      <Pressable onPress={() => router.push("/(tabs)")}>
        <Text>Sign</Text>
      </Pressable>
      <TextComponent
        value={name}
        handleValue={(e) => setName(e)}
        icon="@/assets/images/Group 3091 1.png"
        placeholder={"이름을 입력해주세요."}
      />
      <TextComponent
        value={email}
        handleValue={(e) => setEmail(e)}
        icon="@/assets/images/Group 3091 1.png"
        placeholder={"이메일을을 입력해주세요."}
      />

      {/* <Pressable onPress={() => setIsDateTimePickerOpen(true)}>
        <Text>ggd</Text>
      </Pressable> */}
      <TextComponent
        value={birth}
        handleValue={(e) => setBirth(e)}
        icon="@/assets/images/Group 3091 1.png"
        placeholder={"생년월일을을 입력해주세요."}
      />

      {/* <DateTimePicker
        isVisible={isDateTimePickerOpen}
        mode="date"
        onCancel={() => setIsDateTimePickerOpen(false)}
      /> */}
    </SafeAreaView>
  );
}
