import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  Modal,
} from "react-native";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

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

  const handleConfirm = () => {
    setShowModal(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#333" />
        </Pressable>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>탈퇴 하시는 이유를 알려주세요.</Text>
        <View style={styles.divider} />

        <View style={styles.reasonsContainer}>
          {REASONS.map((reason) => (
            <Pressable
              key={reason}
              style={styles.reasonItem}
              onPress={() => setSelectedReason(reason)}
            >
              <View style={styles.radioContainer}>
                <View
                  style={[
                    styles.radioOuter,
                    selectedReason === reason && styles.radioOuterSelected,
                  ]}
                >
                  {selectedReason === reason && (
                    <View style={styles.radioInner} />
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
      </View>

      <View style={styles.footer}>
        <Pressable style={styles.confirmButton} onPress={handleConfirm}>
          <Text style={styles.confirmButtonText}>확인</Text>
        </Pressable>
      </View>

      <Modal
        visible={showModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>{/* 모달 내용은 추후 구현 */}</View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#4A6FFF",
    marginBottom: 16,
  },
  divider: {
    height: 1,
    backgroundColor: "#E5E5E5",
    marginBottom: 24,
  },
  reasonsContainer: {
    gap: 16,
  },
  reasonItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  radioContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#CCCCCC",
    justifyContent: "center",
    alignItems: "center",
  },
  radioOuterSelected: {
    borderColor: "#4A6FFF",
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#4A6FFF",
  },
  reasonText: {
    fontSize: 16,
    color: "#333333",
  },
  otherReasonInput: {
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
    marginLeft: 32,
    backgroundColor: "#FAFAFA",
  },
  footer: {
    padding: 20,
    alignItems: "flex-end",
  },
  confirmButton: {
    backgroundColor: "#4A6FFF",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  confirmButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 20,
    width: "80%",
  },
});
