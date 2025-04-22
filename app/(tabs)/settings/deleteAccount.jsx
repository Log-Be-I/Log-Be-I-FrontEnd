import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  Modal,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useMemberStore } from "../../../zustand/stores/member";

const REASONS = [
  "원하는 서비스가 아니에요.",
  "자주 이용하지 않아요.",
  "앱 사용 과정이 불편해요.",
  "광고성 알림이 너무 많아요.",
  "이용 가격이 높아요.",
  "기타",
];

export default function DeleteAccount() {
  const router = useRouter();
  const [selectedReason, setSelectedReason] = useState("");
  const [otherReason, setOtherReason] = useState("");
  const [showModal, setShowModal] = useState(false);
  const { clearMember } = useMemberStore();

  const handleConfirm = () => {
    setShowModal(true);
  };

  const handleDelete = async () => {
    try {
      await clearMember();
      router.replace("/");
    } catch (error) {
      console.error("회원 탈퇴 중 오류 발생:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <Text style={styles.title}>회원 탈퇴</Text>
          <Text style={styles.subtitle}>
            탈퇴하시는 이유를 알려주시면 서비스 개선에 도움이 됩니다.
          </Text>

          <View style={styles.reasonsContainer}>
            {REASONS.map((reason, index) => (
              <Pressable
                key={index}
                style={[
                  styles.reasonItem,
                  selectedReason === reason && styles.selectedReason,
                ]}
                onPress={() => setSelectedReason(reason)}
              >
                <View style={styles.radioButton}>
                  {selectedReason === reason && (
                    <View style={styles.radioButtonInner} />
                  )}
                </View>
                <Text style={styles.reasonText}>{reason}</Text>
              </Pressable>
            ))}
          </View>

          {selectedReason === "기타" && (
            <TextInput
              style={styles.otherReasonInput}
              placeholder="탈퇴 사유를 입력해주세요."
              value={otherReason}
              onChangeText={setOtherReason}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          )}
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <Pressable
          style={[
            styles.confirmButton,
            !selectedReason && styles.disabledButton,
          ]}
          onPress={handleConfirm}
          disabled={!selectedReason}
        >
          <Text style={styles.buttonText}>확인</Text>
        </Pressable>
      </View>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleDelete}
      >
        <Text>정말로 탈퇴하시겠습니까?</Text>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 30,
  },
  reasonsContainer: {
    marginBottom: 20,
  },
  reasonItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  selectedReason: {
    backgroundColor: "#f5f5f5",
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#69BAFF",
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  radioButtonInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#69BAFF",
  },
  reasonText: {
    fontSize: 16,
  },
  otherReasonContainer: {
    marginTop: 10,
    marginLeft: 30,
  },
  otherReasonInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    minHeight: 100,
    textAlignVertical: "top",
  },
  buttonContainer: {
    padding: 20,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  confirmButton: {
    backgroundColor: "#69BAFF",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
