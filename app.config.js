import { ExpoConfig, ConfigContext } from "expo/config";
import { config } from "dotenv";

config();

const apiUrl = process.env.EXPO_PUBLIC_API_URL;
const googleClientId = process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID;
const googleClientSecret = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_SECRET;

const defineConfig = () => ({
  name: "Log-Be-I",
  slug: "log-be-i",
  owner: "taekho",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/girogi.png",
  userInterfaceStyle: "light",
  splash: {
    image: "./assets/splashscreen_logo.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff",
  },
  assetBundlePatterns: ["**/*"],
  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.taekho.aegirogilogbei",
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/girogi.png",
      backgroundColor: "#ffffff",
    },
    package: "com.taekho.aegirogilogbei",
    googleServicesFile:
      process.env.GOOGLE_SERVICES_JSON ?? "./google-services.json",
  },
  web: {
    favicon: "./assets/girogi.png",
  },
  plugins: [
    ["expo-router"],
    [
      "expo-build-properties",
      {
        android: {
          compileSdkVersion: 35,
          targetSdkVersion: 35,
          buildToolsVersion: "35.0.0",
        },
      },
    ],
    [
      "expo-av",
      {
        microphonePermission: "음성 기록을 위해서는 음성 권한이 필요합니다.",
      },
    ],
    ["@react-native-google-signin/google-signin"],
    [
      "expo-notifications",
      {
        icon: "./assets/girogi.png",
        color: "#ffffff",
      },
    ],
  ],
  // scheme: "logbei"
  scheme: "com.taekho.aegirogilogbei",
  extra: {
    weatherApiKey: "cfd7da48004b32b5707dc9057ee32248",
    apiUrl: process.env.EXPO_PUBLIC_API_URL,
    googleClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
    googleClientSecret: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_SECRET,
    googleWebClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
    eas: {
      projectId: "3b9fe13c-5188-46fa-80fe-dc73ca917cc4",
    },
    router: {
      origin: false,
    },
  },
  updates: {
    url: "https://u.expo.dev/3b9fe13c-5188-46fa-80fe-dc73ca917cc4",
  },
  runtimeVersion: "1.0.0",
});

export default defineConfig;
