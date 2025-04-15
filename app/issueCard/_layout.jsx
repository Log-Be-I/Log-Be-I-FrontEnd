import { Slot } from "expo-router";
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, StyleSheet } from 'react-native';

export default function IssueCardLayout() {
    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <Header />
          <View style={styles.content}>
            <Slot />
          </View>
          <Footer />
        </SafeAreaView>
      </View>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff",
    },
    safeArea: {
      flex: 1,
    },
    content: {
      flex: 1,
    },
  });