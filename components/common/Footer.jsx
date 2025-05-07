import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Modal,
  Text,
  TouchableOpacity,
  ToastAndroid,
} from "react-native";
import { Audio } from "expo-av";
import FooterItem from "./FooterItem";
import RecordingCard from "./RecordingCard";
import { createAudioRecord } from "../../api/record";
import * as FileSystem from "expo-file-system";
import AsyncStorage from "@react-native-async-storage/async-storage";
import uuid from "react-native-uuid";

export default function Footer({ currentTab, onTabPress }) {
  const [isRecording, setIsRecording] = useState(false);
  const [recording, setRecording] = useState(null);
  const [permissionResponse, requestPermission] = Audio.usePermissions();

  const [isLoading, setIsLoading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [lastSavedUri, setLastSavedUri] = useState(null);

  async function startRecording() {
    try {
      if (recording) {
        await recording.stopAndUnloadAsync();
        await Audio.setAudioModeAsync({ allowsRecordingIOS: false });
        setRecording(null);
        await new Promise((resolve) => setTimeout(resolve, 300));
      }

      if (permissionResponse.status !== "granted") {
        const newPermission = await requestPermission();
        if (newPermission.status !== "granted") {
          alert("마이크 권한이 필요합니다.");
          return;
        }
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const recordingOptions = {
        android: {
          extension: ".m4a",
          outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_MPEG_4,
          audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AAC,
          sampleRate: 44100,
          numberOfChannels: 1,
          bitRate: 128000,
        },
      };

      const { recording: newRecording } = await Audio.Recording.createAsync(
        recordingOptions
      );

      setRecording(newRecording);
      setIsRecording(true);
    } catch (error) {
      console.error("녹음 시작 실패", error);
      alert("녹음 시작 실패");
    }
  }

  async function stopRecording() {
    try {
      if (recording) {
        await recording.stopAndUnloadAsync();
        await Audio.setAudioModeAsync({ allowsRecordingIOS: false });
        const uri = recording.getURI();
        console.log("🎤 저장된 파일 경로:", uri);
        setRecording(null);
        setIsRecording(false);

        const localUri = await saveRecordingLocally(uri);
        setLastSavedUri(localUri);
        console.log("📁 로컬 저장 경로:", localUri);

        if (localUri) {
          setIsLoading(true);
          const result = await uploadRecording(localUri);
          setIsLoading(false);

          if (result) {
            ToastAndroid.show("✅ 기록 저장 완료", ToastAndroid.SHORT);
            setUploadResult(result);
            setShowModal(true);
          } else {
            ToastAndroid.show("❌ 기록 저장 실패", ToastAndroid.SHORT);
          }
        }
      }
    } catch (error) {
      console.error("녹음 중지 실패", error);
      setIsLoading(false);
    }
  }

  async function saveRecordingLocally(originalUri) {
    try {
      const folderUri = FileSystem.cacheDirectory + "recordings/"; // 외부로 노출 가능
      const folderInfo = await FileSystem.getInfoAsync(folderUri);
      if (!folderInfo.exists) {
        await FileSystem.makeDirectoryAsync(folderUri, { intermediates: true });
      }

      const newFileName = `record-${uuid.v4()}.m4a`;
      const newUri = folderUri + newFileName;

      await FileSystem.copyAsync({
        from: originalUri,
        to: newUri,
      });

      return newUri;
    } catch (e) {
      console.error("로컬 저장 실패", e);
      return null;
    }
  }

  async function uploadRecording(uri) {
    try {
      const uploadUrl = "https://logbe-i.com/audio-records";
      const token = await AsyncStorage.getItem("accessToken");

      const result = await FileSystem.uploadAsync(uploadUrl, uri, {
        httpMethod: "POST",
        uploadType: FileSystem.FileSystemUploadType.MULTIPART,
        fieldName: "audio",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (result.status !== 200) {
        console.error("업로드 실패 - 응답코드:", result.status);
        return null;
      }

      const parsed = JSON.parse(result.body);
      return parsed;
    } catch (error) {
      console.error("uploadAsync 실패:", error);
      return null;
    }
  }

  const handleCenterPress = async () => {
    if (isRecording) {
      await stopRecording();
    } else {
      await startRecording();
    }
  };

  const handleExportPathLog = async () => {
    if (!lastSavedUri) {
      ToastAndroid.show("⚠️ 저장된 파일 없음", ToastAndroid.SHORT);
      return;
    }
    console.log("📍 저장된 경로를 외부에서 접근하려면:", lastSavedUri);
    ToastAndroid.show("📍 경로 로그 확인 (콘솔)", ToastAndroid.SHORT);
  };

  return (
    <View style={styles.container}>
      <View style={styles.background} />
      <View style={styles.content}>
        <FooterItem
          name="index"
          active={currentTab === "index"}
          onPress={() => onTabPress("index")}
        />
        <FooterItem
          name="record"
          active={currentTab === "record"}
          onPress={() => onTabPress("record")}
        />
        <FooterItem
          name="center"
          active={false}
          onPress={handleCenterPress}
          isCenter
        />
        <FooterItem
          name="calendar"
          active={currentTab === "calendar"}
          onPress={() => onTabPress("calendar")}
        />
        <FooterItem
          name="settings"
          active={currentTab === "settings"}
          onPress={() => onTabPress("settings")}
        />
      </View>

      {isRecording && <RecordingCard onStop={handleCenterPress} />}

      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#ffffff" />
        </View>
      )}

      <Modal visible={showModal} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>기록이 저장되었어요!</Text>
            <Text style={styles.modalText}>{uploadResult?.content}</Text>
            <TouchableOpacity
              onPress={() => setShowModal(false)}
              style={styles.modalButton}
            >
              <Text style={styles.modalButtonText}>확인</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: "100%", position: "absolute", bottom: 0 },
  background: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 60,
    backgroundColor: "#69BAFF",
  },
  content: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "flex-end",
    height: "100%",
    paddingBottom: 8,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 24,
    borderRadius: 16,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: "#69BAFF",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  modalButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});
