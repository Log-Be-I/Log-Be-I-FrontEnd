import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Audio } from "expo-av";
import FooterItem from "./FooterItem";
import RecordingCard from "./RecordingCard"; // ✅ 추가
import { createAudioRecord } from "../../api/record";

export default function Footer({ currentTab, onTabPress }) {
  const [isRecording, setIsRecording] = useState(false);
  const [recording, setRecording] = useState(null);
  const [permissionResponse, requestPermission] = Audio.usePermissions();

  async function startRecording() {
    try {
      if (recording) {
        console.log("Stopping previous recording...");
        await recording.stopAndUnloadAsync();
        await Audio.setAudioModeAsync({ allowsRecordingIOS: false });
        setRecording(null);
        await new Promise((resolve) => setTimeout(resolve, 300));
      }

      if (permissionResponse.status !== "granted") {
        console.log("Requesting permission...");
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

      const { recording: newRecording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      setRecording(newRecording);
      setIsRecording(true);
    } catch (error) {
      console.error("Failed to start recording", error);
      alert("녹음 시작 실패");
    }
  }

  async function stopRecording() {
    try {
      if (recording) {
        await recording.stopAndUnloadAsync();
        await Audio.setAudioModeAsync({ allowsRecordingIOS: false });
        const uri = recording.getURI();
        console.log("Recording saved at:", uri);
        setRecording(null);
        setIsRecording(false);

        if (uri) {
          console.log("업로드 시작", uri);
          const result = await uploadRecording(uri);
          console.log("업로드 결과", result);
        }
      }
    } catch (error) {
      console.error("Failed to stop recording", error);
    }
  }

  // ✅ 녹음 파일 업로드 함수
  async function uploadRecording(uri) {
    try {
      const formData = new FormData();
      formData.append("audio", {
        // ✅ 수정: file -> audio
        uri,
        name: "recording.m4a",
        type: "audio/m4a",
      });

      const result = await createAudioRecord(formData);

      console.log("업로드 성공!", result);
      return result;
    } catch (error) {
      console.error("업로드 실패", error);
      alert("업로드 실패했습니다.");
    }
  }

  const handleCenterPress = async () => {
    if (isRecording) {
      await stopRecording();
      setIsRecording(false);
    } else {
      await startRecording();
    }
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
  centerButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#69BAFF",
    marginBottom: 20,
  },
});
