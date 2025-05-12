import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

/**
 * 푸시 알림 권한을 요청합니다.
 * @returns {Promise<boolean>} 권한 허용 여부
 */
export const requestNotificationPermissions = async () => {
  // 에뮬레이터에서도 테스트할 수 있도록 Device.isDevice 체크 제거
  //   if (!Device.isDevice) {
  //     console.log("푸시 알림은 실제 기기에서만 동작합니다.");
  //     return false;
  //   }
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    console.log("푸시 알림 권한이 거부되었습니다.");
    return false;
  }

  return true;
};

/**
 * 현재 푸시 알림 권한 상태를 확인합니다.
 * @returns {Promise<boolean>} 권한 허용 여부
 */
export const checkNotificationPermissions = async () => {
  const { status } = await Notifications.getPermissionsAsync();
  return status === "granted";
};

/**
 * 푸시 알림 채널을 설정합니다 (Android 전용).
 */
export const configureNotificationChannel = async () => {
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
      enableVibrate: true,
    });
  }
};
