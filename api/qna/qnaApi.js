import { CurrentRenderContext } from "@react-navigation/native";
import { axiosWithToken } from "../axios/axios"; // axios 설정 import

export const getMyQuestions = async ({
  page = 1,
  size = 4,
  orderBy = "DESC",
}) => {
  try {
    const response = await axiosWithToken.get("/questions/my", {
      params: { page, size, orderBy },
    });
    return response.data;
  } catch (error) {
    console.error("내 문의 조회 실패:", error);
    throw error;
  }
};

export const getQuestionDetail = async (questionId) => {
  try {
    const response = await axiosWithToken.get(`/questions/${questionId}`);

    return response.data;
  } catch (error) {
    console.error("문의 상세 조회 실패:", error);
    throw error;
  }
};

export const postMyQuestion = async (title, content, questionImage = null) => {
  const payload = {
    title,
    content,
    image: questionImage,
  };
  try {
    const response = await axiosWithToken.post("/questions", payload);

    console.log("문의 등록 성공:", response.data);
    return response.data;
  } catch (error) {
    console.error("문의 등록 실패:", error);
    throw error;
  }
};

export const updateMyQuestion = async (questionId, updatedData) => {
  try {
    const response = await axiosWithToken.patch(
      `/questions/${questionId}`,
      updatedData
    );

    console.log("문의 수정 성공:", response.data);
    return response.data;
  } catch (error) {
    console.error("문의 수정 실패:", error);
    throw error;
  }
};

export const deleteMyQuestion = async (questionId) => {
  try {
    const response = await axiosWithToken.delete(`/questions/${questionId}`);

    console.log("문의 삭제 성공:", response.data);
    return response.data;
  } catch (error) {
    console.error("문의 삭제 실패:", error);
    throw error;
  }
};
