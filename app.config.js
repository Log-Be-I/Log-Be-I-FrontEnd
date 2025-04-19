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
      intentFilters: [
        {
          action: "VIEW",
          data: [
            {
              scheme: "com.taekho.logbei",
              host: "oauthredirect",
            },
          ],
          category: ["BROWSABLE", "DEFAULT"],
        },
      ],
    },
    web: {
      favicon: "./assets/favicon.png",
    },
    plugins: ["expo-router"],
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
    fonts: [
      "./assets/fonts/Pretendard-Regular.otf",
      "./assets/fonts/Pretendard-Bold.otf",
      "./assets/fonts/Pretendard-Medium.otf",
      "./assets/fonts/Pretendard-SemiBold.otf",
    ],
  },
};
