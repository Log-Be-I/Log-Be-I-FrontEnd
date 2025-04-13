// components/common/Footer.jsx

import React from "react";
import { View, StyleSheet } from "react-native";
import FooterItem from "./FooterItem";

export default function Footer({ currentTab, onTabPress }) {
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
        <FooterItem name="center" active={false} onPress={() => {}} isCenter />
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
