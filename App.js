import { ExpoRoot } from "expo-router";
import { LogBox, Platform } from "react-native";
import GlobalErrorBoundary from "./components/common/GlobalErrorBoundary";

// LogBox.ignoreAllLogs();

// // 웹에서 예외처리
// if (typeof window !== "undefined") {
//   window.onerror = function (message, source, lineno, colno, error) {
//     if (
//       message?.toString().includes("client_secret is missing") ||
//       error?.message?.toString().includes("client_secret is missing")
//     ) {
//       console.log("🚫 무시된 windows 자동 token 요청 에러:", message);
//       return true; // prevent default behavior
//     }
//   };

//   window.addEventListener("unhandledrejection", (event) => {
//     if (
//       event.reason?.message?.toString().includes("client_secret is missing") ||
//       event.reason?.toString().includes("client_secret is missing")
//     ) {
//       event.preventDefault();
//       console.log("🚫 무시된 unhandled rejection:", event.reason);
//     }
//   });
// }
// const defaultHandler = global.ErrorUtils.getGlobalHandler();

// global.ErrorUtils.setGlobalHandler((error, isFatal) => {
//   if (
//     error.message.includes("client_secret is missing") ||
//     error.toString().includes("client_secret is missing")
//   ) {
//     console.log("🚫 App에서 무시된 자동 token 요청 에러:", error.message);
//     return;
//   }
//   defaultHandler(error, isFatal);
// });

export default function App() {
  LogBox.ignoreLogs(["client_secret is missing"]);
  const ctx = require.context("./app");
  return <ExpoRoot context={ctx} />;
}
