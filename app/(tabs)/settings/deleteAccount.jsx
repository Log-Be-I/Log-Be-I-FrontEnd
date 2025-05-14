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
import { SafeAreaView } from "react-native-safe-area-context";
import { useMemberStore } from "../../../zustand/stores/member";
import { deleteMember } from "../../../api/member";

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
  const { member, clearMember } = useMemberStore();

  const handleConfirm = () => {
    setShowModal(true);
  };

  const handleBack = () => {
    router.back();
  };

  const handleDelete = async () => {
    try {
      const response = await deleteMember(member.memberId);
      if (response.status === 204) {
        await clearMember();
        router.replace("/(onBoard)");
      } else {
        console.log("탈퇴에 실패했습니다. 다시 시도해 주세요.");
      }
    } catch (error) {
      console.error("회원 탈퇴 중 오류 발생:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Pressable onPress={handleBack} style={{ padding: 20 }}>
        <Text style={{ color: "#69BAFF" }}>← 뒤로가기</Text>
      </Pressable>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>탈퇴 하시는 이유를 알려주세요.</Text>

        <View style={styles.reasonsContainer}>
          {REASONS.map((reason, index) => (
            <Pressable
              key={index}
              style={[
                styles.reasonItem,
                selectedReason === reason && styles.selectedReasonItem,
              ]}
              onPress={() => setSelectedReason(reason)}
            >
              <View style={styles.radioWrapper}>
                <View style={styles.radioButton}>
                  {selectedReason === reason && (
                    <View style={styles.radioButtonInner} />
                  )}
                </View>
                <Text style={styles.reasonText}>{reason}</Text>
              </View>
            </Pressable>
          ))}

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
        visible={showModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.prettyCardExpanded}>
            <Text style={styles.modalTitleLarge}>정말 떠나시는 건가요?</Text>
            <View style={styles.modalLine} />
            <View style={styles.modalListContainer}>
              <Text style={styles.modalList}>
                • 회원 탈퇴 후, 가입 정보 및 이용 내역은 복구할 수 없습니다.
              </Text>
              <Text style={styles.modalList}>
                • 구매 내역, 쿠폰, 포인트 등 모든 혜택이 소멸됩니다.
              </Text>
              <Text style={styles.modalList}>
                • 탈퇴 후 동일한 이메일(또는 휴대폰 번호)로 재가입이 제한될 수
                있습니다.
              </Text>
              <Text style={styles.modalList}>
                • 탈퇴 후 일정 기간 동안 법적 의무에 따라 일부 정보가 보관될 수
                있습니다.
              </Text>
            </View>
            <View style={styles.modalButtons}>
              <Pressable
                onPress={() => setShowModal(false)}
                style={styles.modalCancelBtn}
              >
                <Text style={styles.modalCancelText}>CANCEL</Text>
              </Pressable>
              <Pressable onPress={handleDelete} style={styles.modalConfirmBtn}>
                <Text style={styles.modalConfirmText}>OK</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    paddingHorizontal: 24,
    paddingVertical: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#032B77",
    marginBottom: 28,
  },
  reasonsContainer: {
    gap: 16,
  },
  reasonItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  selectedReasonItem: {
    backgroundColor: "#f9f9f9",
  },
  radioWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#69BAFF",
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#69BAFF",
  },
  reasonText: {
    fontSize: 16,
    color: "#333",
  },
  otherReasonInput: {
    marginTop: 16,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 14,
    fontSize: 14,
    minHeight: 100,
    backgroundColor: "#fff",
  },
  buttonContainer: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    backgroundColor: "#fff",
    paddingBottom: 100,
  },
  confirmButton: {
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: "center",
    backgroundColor: "#69BAFF",
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    fontFamily: "Pretendard-Bold",
  },
  // 모달 커스텀
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  prettyModal: {
    width: "85%",
    alignItems: "center",
  },
  modalHeader: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#3b5998",
    marginBottom: 12,
    borderBottomWidth: 2,
    borderColor: "#69BAFF",
    paddingBottom: 6,
  },
  prettyCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingVertical: 28,
    paddingHorizontal: 24,
    alignItems: "center",
    shadowColor: "#69BAFF",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "800",
    textAlign: "center",
    color: "#2c2c2c",
    marginBottom: 10,
  },
  modalLine: {
    width: "80%",
    height: 1,
    backgroundColor: "#ccc",
    marginVertical: 12,
    alignSelf: "center",
  },
  modalSub: {
    fontSize: 14,
    textAlign: "center",
    color: "#888",
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: "row",
    gap: 16,
    alignSelf: "center",
  },
  modalCancelBtn: {
    paddingVertical: 10,
    paddingHorizontal: 22,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: "#FF7777",
    backgroundColor: "#fff",
    shadowColor: "#FF7777",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
    width: "35%",
  },
  modalCancelText: {
    color: "#FF7777",
    fontWeight: "bold",
    fontSize: 14,
    fontFamily: "Pretendard-Bold",
    textAlign: "center",
  },
  modalConfirmBtn: {
    paddingVertical: 10,
    paddingHorizontal: 22,
    borderRadius: 24,
    borderColor: "#69BAFF",
    borderWidth: 1.5,
    backgroundColor: "#FFF",
    shadowColor: "#69BAFF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 5,
    width: "35%",
  },
  modalConfirmText: {
    color: "#69BAFF",
    fontWeight: "bold",
    fontSize: 14,
    fontFamily: "Pretendard-Bold",
    textAlign: "center",
  },
  modalTitleLarge: {
    fontSize: 20,
    fontWeight: "800",
    color: "#2c2c2c",
    textAlign: "center",
    marginBottom: 12,
  },

  prettyCardExpanded: {
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingVertical: 30,
    paddingHorizontal: 26,
    width: "85%",
    shadowColor: "#69BAFF",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },

  modalListContainer: {
    alignSelf: "stretch",
    marginBottom: 24,
    gap: 8,
  },

  modalList: {
    fontSize: 13.5,
    color: "#FF5555",
    lineHeight: 20,
  },
});
