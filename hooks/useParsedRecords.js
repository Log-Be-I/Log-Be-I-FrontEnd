import { useMemo } from "react";
import dayjs from "dayjs";

// dateString: '2024-04-27T16:22:00' (KST 기준)
function parseKST(dateString) {
  if (!dateString) return { record_time: "", record_date: "" };
  const dateObj = new Date(dateString);
  console.log("parseKST dateString:", dateString, "dateObj:", dateObj);
  // KST로 안전하게 출력
  const record_time = dateObj.toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Asia/Seoul",
  });
  // getFullYear/getMonth/getDate로 안전하게 생성
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const day = String(dateObj.getDate()).padStart(2, "0");
  const record_date = `${year}-${month}-${day}`;
  return { record_time, record_date };
}

export default function useParsedRecords(records) {
  return useMemo(() => {
    if (!Array.isArray(records)) return [];
    return records.map((record) => {
      const d = dayjs(record.recordDateTime);
      return {
        ...record,
        record_time: d.format("HH:mm"),
        record_date: d.format("YYYY-MM-DD"),
      };
    });
  }, [records]);
}
