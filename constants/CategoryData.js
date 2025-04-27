import { useMemberStore } from "../zustand/stores/member";

// 카테고리 상수 정의
export const CATEGORIES = [
  {
    categoryId: 1,
    name: "일상",
    icon: "notebook-outline",
    color: "#69BAFF",
  },
  {
    categoryId: 2,
    name: "소비",
    icon: "piggy-bank",
    color: "#FFD700",
  },
  {
    categoryId: 3,
    name: "건강",
    icon: "clipboard-pulse",
    color: "#FF3D92",
  },
  {
    categoryId: 4,
    name: "할 일",
    icon: "clipboard-check-outline",
    color: "#4CAF50",
  },
  {
    categoryId: 5,
    name: "기타",
    icon: "dots-horizontal-circle-outline",
    color: "#333333",
  },
];

// 카테고리 ID로 카테고리 정보 찾기
export const getCategoryById = (categoryId) => {
  return (
    CATEGORIES.find((cat) => cat.categoryId === categoryId) || CATEGORIES[4]
  ); // 기본값: 기타
};

// 카테고리 이름으로 카테고리 정보 찾기
export const getCategoryByName = (categoryName) => {
  return CATEGORIES.find((cat) => cat.name === categoryName) || CATEGORIES[4]; // 기본값: 기타
};

// 카테고리 아이콘 매핑 (RecordList에서 사용)
export const CATEGORY_ICONS = {
  일상: {
    name: "notebook-outline",
    color: "#69BAFF",
  },
  소비: {
    name: "piggy-bank",
    color: "#FFD700",
  },
  할일: {
    name: "clipboard-check-outline",
    color: "#4CAF50",
  },
  건강: {
    name: "clipboard-pulse",
    color: "#FF3D92",
  },
  기타: {
    name: "dots-horizontal-circle-outline",
    color: "#333333",
  },
};
