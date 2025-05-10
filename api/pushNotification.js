import { axiosWithToken } from "./axios/axios";

export const sendPushNotification = async (expoPushToken, title, body) => {
    try {
        const response = await axiosWithToken.post("https://exp.host/--/api/v2/push/send", {
            sound: 'default',
            title,
            body,
            data: {
                customData: 'data',
            },
        });
        console.log("✅ 푸시 알림 전송 성공:", response.data);
    } catch (error) {
        console.error("푸시 알림 전송 오류:", error);
    }
};

// // 주간 레포트 알림 전송 예제
// import { sendPushNotification } from "./api/pushNotification";

// // 서버에서 모든 사용자에게 주간 레포트 푸시 알림 전송
// const sendWeeklyReport = async () => {
//   const userTokens = ["ExponentPushToken[xxxxxxx]", "ExponentPushToken[yyyyyyy]"];
//   userTokens.forEach(async (token) => {
//     await sendPushNotification(token, "📊 주간 레포트", "이번 주 활동을 확인하세요.");
//   });
// };

// // 매주 월요일 오전 9시에 주간 레포트 알림 전송
// setInterval(() => {
//   const now = new Date();
//   if (now.getDay() === 1 && now.getHours() === 9) {
//     sendWeeklyReport();
//   }
// }, 60 * 60 * 1000); // 1시간마다 확인