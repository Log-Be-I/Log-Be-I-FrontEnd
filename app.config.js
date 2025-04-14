export default {
  expo: {
    name: "Log-Be-I-FrontEnd",
    slug: "Log-Be-I-FrontEnd",
    owner: "taekho",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/splash.png",
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
      package: "host.exp.exponent",
    },
    web: {
      favicon: "./assets/favicon.png",
    },
    plugins: ["expo-router"],
    scheme: "exp",
    extra: {
      weatherApiKey: "cfd7da48004b32b5707dc9057ee32248",
      eas: {
        projectId: "eb44fbab-8a26-4d1f-9cab-feab7bfda629",
      },
      googleRedirectUri: "exp://localhost:19000/--/oauth2redirect/google",
      // googleRedirectUri: "https://auth.expo.io/@taekho/log-be-i-frontend",
      androidClientId:
        "215620278394-94173ohrtpcpsmj1bhf6qhabcp2p9ks9.apps.googleusercontent.com",
      router: {
        origin: false,
      },
    },
    updates: {
      url: "https://u.expo.dev/eb44fbab-8a26-4d1f-9cab-feab7bfda629",
    },
    runtimeVersion: {
      policy: "appVersion",
    },
    fonts: [
      "./assets/fonts/Pretendard-Regular.otf",
      "./assets/fonts/Pretendard-Bold.otf",
      "./assets/fonts/Pretendard-Medium.otf",
      "./assets/fonts/Pretendard-SemiBold.otf",
    ],
  },
};
