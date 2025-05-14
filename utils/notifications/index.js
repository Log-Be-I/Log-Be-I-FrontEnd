import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  requestNotificationPermissions,
  configureNotificationChannel,
} from "./permissions";
import {
  configureNotificationHandlers,
  setNotificationResponseHandler,
  setNotificationReceivedHandler,
  showNotification,
} from "./handlers";
import { registerPushToken, unregisterPushToken } from "../../api/push";

const PUSH_TOKEN_KEY = "@push_token";

/**
 * 푸시 알림을 초기화합니다.
 */
export const initializeNotifications = async () => {
  // 권한 요청
  const hasPermission = await requestNotificationPermissions();
  if (!hasPermission) return false;

  // 알림 채널 설정 (Android)
  await configureNotificationChannel();

  // 알림 핸들러 설정
  configureNotificationHandlers();

  return true;
};

/**
 * 푸시 토큰을 발급받고 저장합니다.
 * @returns {Promise<string|null>} 푸시 토큰
 */
export const getPushToken = async () => {
  try {
    // 저장된 토큰이 있는지 확인
    const savedToken = await AsyncStorage.getItem(PUSH_TOKEN_KEY);
    console.log("저장된 푸시 토큰:", savedToken);

    if (savedToken) return savedToken;

    console.log("새 푸시 토큰 발급 시도...");
    // 새 토큰 발급
    const { data: token } = await Notifications.getExpoPushTokenAsync({
      projectId: "3b9fe13c-5188-46fa-80fe-dc73ca917cc4", // app.config.js의 eas.projectId
    });
    console.log("발급된 푸시 토큰:", token);

    // 토큰 저장
    await AsyncStorage.setItem(PUSH_TOKEN_KEY, token);
    console.log("푸시 토큰 저장 완료");

    return token;
  } catch (error) {
    console.error("푸시 토큰 발급 실패:", error);
    return null;
  }
};

/**
 * 저장된 푸시 토큰을 삭제합니다.
 */
export const removePushToken = async () => {
  try {
    await AsyncStorage.removeItem(PUSH_TOKEN_KEY);
  } catch (error) {
    console.error("푸시 토큰 삭제 실패:", error);
  }
};

/**
 * 테스트용 로컬 알림을 전송합니다.
 * @param {Object} options 알림 옵션
 * @param {string} options.title 알림 제목
 * @param {string} options.body 알림 내용
 * @param {string} options.type 알림 타입 (notice, schedule, analysis)
 */
export const sendTestNotification = async ({
  title = "테스트 알림",
  body = "푸시 알림이 정상적으로 동작합니다.",
  type = "notice",
} = {}) => {
  try {
    console.log("알림 전송 시도:", { title, body, type });

    // 알림 권한 확인
    const { status } = await Notifications.getPermissionsAsync();
    console.log("알림 권한 상태:", status);

    if (status !== "granted") {
      console.log("알림 권한이 없습니다.");
      return;
    }

    const notificationContent = {
      title,
      body,
      data: { type },
      sound: true,
      priority: Notifications.AndroidNotificationPriority.HIGH,
      vibrate: [0, 250, 250, 250],
    };

    console.log("알림 내용:", notificationContent);

    await Notifications.scheduleNotificationAsync({
      content: notificationContent,
      trigger: null, // 즉시 표시
    });

    console.log("알림 전송 완료");
  } catch (error) {
    console.error("알림 전송 실패:", error);
  }
};

/**
 * 로그인 시 푸시 토큰을 발급하고 서버에 등록합니다.
 * @returns {Promise<boolean>} 성공 여부
 */
export const setupPushToken = async () => {
  try {
    const token = await getPushToken();
    if (!token) {
      console.log("푸시 토큰 발급 실패");
      return false;
    }

    const registered = await registerPushToken(token);
    if (!registered) {
      console.log("푸시 토큰 서버 등록 실패");
      return false;
    }

    console.log("푸시 토큰 설정 완료");
    return true;
  } catch (error) {
    console.error("푸시 토큰 설정 실패:", error);
    return false;
  }
};

/**
 * 로그아웃 시 푸시 토큰을 삭제합니다.
 * @returns {Promise<boolean>} 성공 여부
 */
export const cleanupPushToken = async () => {
  try {
    const token = await AsyncStorage.getItem(PUSH_TOKEN_KEY);
    if (token) {
      await unregisterPushToken(token);
    }
    await removePushToken();
    return true;
  } catch (error) {
    console.error("푸시 토큰 정리 실패:", error);
    return false;
  }
};

// handlers.js의 함수들도 export
export {
  configureNotificationHandlers,
  setNotificationResponseHandler,
  setNotificationReceivedHandler,
  showNotification,
};
