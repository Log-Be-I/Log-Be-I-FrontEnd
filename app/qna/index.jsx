import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useState, useEffect, useCallback } from "react";
import CustomSelectBox from "../../components/qna/CustomSelectBox";
import QnaCardWrapper from "../../components/qna/QnaCardWrapper";
import Pagination from "../../components/common/Pagination";
import SaveButton from "../../components/qna/SaveButton";
import NoMyQuestion from "../../components/qna/NoMyQuestion";
import { getMyQuestions } from "../../api/qna/qnaApi";
import { format } from "date-fns";

export default function QnaPage() {
  const router = useRouter();
  const [selected, setSelected] = useState("latest");
  const [questions, setQuestions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [groupIndex, setGroupIndex] = useState(0);
  const itemsPerPage = 4;
  const { keywords } = useLocalSearchParams();
  const [titleKeyword, setTitleKeyword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchQuestions();
  }, [selected, currentPage]);
  

  const fetchQuestions = async () => {
    setIsLoading(true);
    try {
      const response = await getMyQuestions({
        page: currentPage,
        size: itemsPerPage,
        orderBy: selected === "latest" ? "DESC" : "ASC",
      });
 
        const questionsData = response.data || [];
        const pageInfo = response.pageInfo || {};
        //console.log("✅ 상태로 설정된 questions:", questionsData);
        console.log("✅ 페이지 정보:", pageInfo);

        setQuestions(questionsData);
        setTotalPages(pageInfo.totalPages || 1);

    } catch (error) {
      console.error("질문 조회 중 오류 발생:", error);
      setQuestions([]); // 오류 발생 시 빈 배열로 설정
      setTotalPages(1);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    router.replace("/(tabs)/")
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={handleBack} style={styles.backButton}>
          <Icon name="chevron-back" size={24} color="#000" />
        </Pressable>
        <Text style={styles.headerTitle}>나의 QnA</Text>
      </View>

      <View style={styles.buttonContainer}>
        <View style={styles.dropdownContainer}>
          <CustomSelectBox
            selected={selected}
            setSelected={setSelected}
            options={[
              { key: "latest", value: "최신글" },
              { key: "oldest", value: "오래된 글" },
            ]}
          />
        </View>
        <SaveButton onPress={() => router.push("/qna/register")}>
          <Text style={styles.butontext}>Register</Text>
        </SaveButton>
      </View>

      <View style={{ flex: 1 }}>
        {!isLoading && questions.length === 0 ? (
          <NoMyQuestion />
        ) : (
          <>
            {questions.map((item, index) => {
              //console.log("✅ 렌더링 질문:", index + 1, item);
              const formattedDate = format(
                new Date(item.createdAt),
                "yyyy-MM-dd"
              );
              return (
                <QnaCardWrapper
                  key={`${item.questionId}-${index}`}
                  title={item.title}
                  createdAt={formattedDate}
                  questionAnswerStatus={item.questionAnswerStatus}
                  onPress={() => {
                    router.push({
                      pathname: `/qna/detailQnA`,
                      params: {
                        id: item.questionId,
                        title: item.title,
                        content: item.content,
                        createdAt: item.createdAt,
                        questionAnswerStatus: item.question_answer_status,
                        questionImage: item.question_image,
                      },
                    });
                  }}
                />
              );
            })}
            <View style={styles.paginationContainer}>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => setCurrentPage(page)}
              />
            </View>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  backButton: {
    padding: 10,
    marginLeft: 10,
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 25,
    fontWeight: "600",
    marginRight: 44,
    color: "#82ACF1",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#ffffff",
    zIndex: 100,
  },
  butontext: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  dropdownContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    position: "relative",
    //right:280,
  },
  listContainer: {
    paddingVertical: 8,
    paddingBottom: 32,
  },
  paginationContainer: {
    position: "absolute",
    bottom: 180,
    width: "100%",
    backgroundColor: "white",
    zIndex: 10,
    paddingVertical: 10,
    alignItems: "center",
  },
});
