import { ExpoRoot } from "expo-router";
import { LogBox } from "react-native";

export default function App() {
  LogBox.ignoreLogs(["client_secret is missing"]);
  const ctx = require.context("./app");
  return <ExpoRoot context={ctx} />;
}
