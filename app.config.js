import { ExpoConfig, ConfigContext } from "expo/config";
import { config } from "dotenv";

config();

const apiUrl = process.env.EXPO_PUBLIC_API_URL;
const googleClientId = process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID;
const googleClientSecret = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_SECRET;

const defineConfig = () => ({
  name: "Log-Be-I-FrontEnd",
  slug: "Log-Be-I-FrontEnd",
  owner: "taekho",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "light",
  splash: {
    image: "./assets/splashscreen_logo.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff",
  },
  assetBundlePatterns: ["**/*"],
  ios: {
    supportsTablet: true,
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#ffffff",
    },
    package: "com.taekho.logbei",
  },
  web: {
    favicon: "./assets/app_icon.png",
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
  ],
  // scheme: "logbei"
  scheme: "com.taekho.logbei",
  extra: {
    weatherApiKey: "cfd7da48004b32b5707dc9057ee32248",
    eas: {
      projectId: "eb44fbab-8a26-4d1f-9cab-feab7bfda629",
    },
    router: {
      origin: false,
    },
  },
  updates: {
    url: "https://u.expo.dev/eb44fbab-8a26-4d1f-9cab-feab7bfda629",
  },
  runtimeVersion: "1.0.0",
});

export default defineConfig;
