import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

/**
 * 알림 핸들러를 설정합니다.
 */
export const configureNotificationHandlers = () => {
  // 포그라운드 알림 설정
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });
};

/**
 * 알림 응답 핸들러를 설정합니다.
 * @param {Function} callback 알림 응답 시 실행할 콜백 함수
 */
export const setNotificationResponseHandler = (callback) => {
  return Notifications.addNotificationResponseReceivedListener(callback);
};

/**
 * 알림 수신 핸들러를 설정합니다.
 * @param {Function} callback 알림 수신 시 실행할 콜백 함수
 */
export const setNotificationReceivedHandler = (callback) => {
  return Notifications.addNotificationReceivedListener(callback);
};

/**
 * 알림을 표시합니다.
 * @param {Object} notification 알림 객체
 * @param {string} notification.title 알림 제목
 * @param {string} notification.body 알림 내용
 * @param {Object} notification.data 추가 데이터
 */
export const showNotification = async ({ title, body, data = {} }) => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      data,
    },
    trigger: null, // 즉시 표시
  });
};
