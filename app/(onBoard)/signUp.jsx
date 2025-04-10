import { View, StyleSheet, Text } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import TextComponent from "../../components/onBoard/text";
import Button from "../../components/onBoard/button";
import { useState } from "react";
import LogBeIText from '../../assets/images/logBeIText.svg';

export default function SignUp() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [birth, setBirth] = useState("");

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.background} />
      <View style={styles.contentContainer}>
        <View>
          <LogBeIText width={100} height={40} style={styles.logo} />
          <Text style={styles.title}>Register</Text>
          
          <View style={styles.inputContainer}>
            <TextComponent
              value={name}
              handleValue={(e) => setName(e)}
              icon="person"
              placeholder="홍길동"
            />
            <TextComponent
              value={email}
              handleValue={(e) => setEmail(e)}
              icon="mail"
              placeholder="gildonghong@gmail.com"
            />
            <TextComponent
              value={birth}
              handleValue={(e) => setBirth(e)}
              icon="calendar"
              placeholder="1999-12-21"
            />
          </View>
        </View>

        <Button 
          text="Register" 
          onPress={() => router.push("/(tabs)")}
        />
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
  logo: {
    marginTop: 40,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#2D64E6',
    marginBottom: 30,
  },
  inputContainer: {
    gap: 20,
  },
});
