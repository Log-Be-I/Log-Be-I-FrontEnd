export const formatForJavaLocalDateTime = (date) => {
  const tzOffset = 9 * 60 * 60 * 1000; // 한국 시간
  const kst = new Date(date.getTime() + tzOffset);
  return kst.toISOString().slice(0, 19); // 'Z' 제거하고 초까지 자름
};

// 현재 한국 날짜를 LocalDateTime 형식의 문자열로 반환
export const getKoreanToday = () => {
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  const kstDate = new Date(utc + 9 * 60 * 60 * 1000);

  const year = kstDate.getFullYear();
  const month = String(kstDate.getMonth() + 1).padStart(2, "0");
  const day = String(kstDate.getDate()).padStart(2, "0");

  const today = `${year}-${month}-${day}`;
  return today;
};
