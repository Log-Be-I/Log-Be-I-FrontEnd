// components/common/Footer.jsx

import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import FooterItem from "./FooterItem";
import { Audio } from "expo-av";

export default function Footer({ currentTab, onTabPress }) {
  const [isRecording, setIsRecording] = useState(false);
  const [permissionResponse, requestPermission] = Audio.usePermissions();

  const [recording, setRecording] = useState();

  async function startRecording() {
    try {
      if (permissionResponse.status !== "granted") {
        console.log("Requesting permission..");
        await requestPermission();
      }
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      console.log("Starting recording..");
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
      console.log("Recording started");
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  }

  async function stopRecording() {
    console.log("Stopping recording..");
    await recording.stopAndUnloadAsync();
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
    });
    const uri = recording.getURI();
    console.log("Recording stopped and stored at", uri);
  }

  const handleRecord = () => {
    if (isRecording) {
      stopRecording();
      setIsRecording(false);
    } else {
      startRecording();
      setIsRecording(true);
    }
  };

  useEffect(() => {
    console.log(recording);
  }, [recording]);

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
          onPress={handleRecord}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    position: "absolute",
    bottom: 0,
  },
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
});
