// 통합된 MemberInfo 화면 - editMode 기반
import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  Pressable,
  ScrollView,
  TextInput,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUserStore } from "../../zustand/useUserStore";
import TextComponent from "../../components/onBoard/text";
import { RegionDropdown } from "../../components/common/RegionDropdown";
import ProfileIcon from "../../assets/sidebar/sidebarProfile/aegiRogiProfile.svg";
import PencilIcon from "../../assets/sidebar/sidebarProfile/pencil.svg";
import CameraIcon from "../../assets/sidebar/sidebarProfile/cameraIcon.svg";
import EmailIcon from "../../assets/sidebar/sidebarProfile/caseIcon.svg";
import LocationIcon from "../../assets/sidebar/sidebarProfile/locationIcon.svg";
import BirthIcon from "../../assets/images/birthDay.svg";
import MyProfile from "../../assets/sidebar/sidebarProfile/myProfile.svg";
import BirthInput from "../../components/common/BirthInput";
import { updateMember } from "../../api/member";
import Icon from "react-native-vector-icons/Ionicons";
import { useMemberStore } from "../../zustand/stores/member";

export default function MemberInfo() {
  const router = useRouter();
  const { member, setMember } = useMemberStore();
  const [isEditMode, setIsEditMode] = useState(false);
  const [nicknameInput, setNicknameInput] = useState(member.nickname);
  const [birthInput, setBirthInput] = useState(member.birth);
  const [selectedCity, setSelectedCity] = useState(
    member.region?.split(" ")[0] || ""
  );
  const [selectedDistrict, setSelectedDistrict] = useState(
    member.region?.split(" ")[1] || ""
  );

  const handleSave = async () => {
    try {
      const newRegion =
        selectedCity !== "" && selectedDistrict !== ""
          ? `${selectedCity} ${selectedDistrict}`
          : member.region;

          console.log("✅ 최종 지역 값:", newRegion);
          console.log("✅ 닉네임:", nicknameInput);
          console.log("✅ 생년월일:", birthInput);
          console.log("✅ member.nickname:", member.nickname);
          console.log("✅ member.birth:", member.birth);

    // ✅ 최신 상태 반영 - 사용자 입력 값만 적용
    const updatedData = {
      nickname: nicknameInput ? nicknameInput : member.nickname,
      birth: birthInput ? birthInput : member.birth,
      region: newRegion ? newRegion : member.region,
    };

      console.log("✅ 수정할 데이터:", updatedData);

      // ✅ 수정 API 요청
      const response = await updateMember(member.memberId, updatedData);
      console.log("response: ", response);

      // 상태 업데이트
      setMember({
        ...member,
        ...updatedData, // 최신 데이터로 상태 업데이트
      });
      setIsEditMode(false);
    } catch (error) {
      console.error("회원 정보 수정 실패:", error);
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBackground} />
      <Pressable onPress={handleBack} style={styles.backButton}>
        <Icon name="chevron-back" size={24} color="#000" />
      </Pressable>
      <View style={styles.bottomBackground} />
      {isEditMode && (
        <View style={styles.header}>
          <Pressable style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.buttonText}>저장</Text>
          </Pressable>
          <Pressable
            style={styles.cancelButton}
            onPress={() => setIsEditMode(false)}
          >
            <Text style={[styles.buttonText, styles.cancelText]}>취소</Text>
          </Pressable>
        </View>
      )}

      <SafeAreaView style={styles.content}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={{ paddingBottom: 200 }}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.profileSection}>
            <View style={styles.profileDiamond}>
              <View style={styles.profileCircle}>
                <ProfileIcon width={70} height={70} />
              </View>
            </View>
            {isEditMode && (
              <View style={styles.cameraIcon}>
                <CameraIcon width={24} height={24} />
              </View>
            )}
          </View>

          <View style={styles.nicknameContainer}>
            <View style={styles.nicknameSection}>
              {isEditMode ? (
                <TextInput
                  style={styles.nicknameInput}
                  value={nicknameInput}
                  onChangeText={setNicknameInput}
                  placeholder="애기로기"
                />
              ) : (
                <Text style={styles.nickname}>{member.nickname}</Text>
              )}
              {!isEditMode && (
                <Pressable onPress={() => setIsEditMode(true)}>
                  <PencilIcon width={24} height={24} />
                </Pressable>
              )}
            </View>
          </View>

          <View style={styles.infoContainer}>
            <TextComponent
              value={member.email}
              iconComponent={<EmailIcon width={20} height={20} />}
              editable={false}
              textColor="#032B77"
            />
            <TextComponent
              value={member.name}
              iconName="person"
              editable={false}
              textColor="#032B77"
            />
            {isEditMode ? (
              <BirthInput
                value={birthInput}
                handleValue={setBirthInput}
                //setValue={(text) => setBirthInput(text)}
                placeholder={member.birth}
              />
            ) : (
              <TextComponent
                value={member.birth}
                iconComponent={<BirthIcon width={20} height={20} />}
                editable={false}
                textColor="#032B77"
              />
            )}
            {isEditMode ? (
              <RegionDropdown
                selectedCity={selectedCity}
                setSelectedCity={setSelectedCity}
                selectedDistrict={selectedDistrict}
                setSelectedDistrict={setSelectedDistrict}
              />
            ) : (
              <TextComponent
                value={member.region}
                iconComponent={<LocationIcon width={20} height={20} />}
                editable={false}
                textColor="#032B77"
              />
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "30%",
    backgroundColor: "rgba(105, 186, 255, 0.3)",
    zIndex: 0,
  },
  backButton: {
    position: "absolute",
    top: 100,
    left: 16,
    zIndex: 10,
  },
  bottomBackground: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "72%",
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 30,
  },
  header: {
    position: "absolute",
    top: 100,
    right: 16,
    flexDirection: "row",
    gap: 12,
    zIndex: 10, // 다른 요소 위에 뜨도록
  },
  saveButton: {
    backgroundColor: "#69BAFF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  cancelButton: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#FF7777",
  },
  buttonText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  cancelText: {
    color: "#FF7777",
  },
  content: {
    flex: 1,
    zIndex: 1,
  },
  scrollView: {
    flex: 1,
    paddingTop: 60,
  },
  profileSection: {
    alignItems: "center",
    marginTop: "25%",
  },
  profileDiamond: {
    width: 120,
    height: 120,
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: "#F0F4FA",
    transform: [{ rotate: "45deg" }],
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  profileCircle: {
    width: 110,
    height: 110,
    borderRadius: 70,
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: "#F0F4FA",
    transform: [{ rotate: "-45deg" }],
    justifyContent: "center",
    alignItems: "center",
  },
  nicknameContainer: {
    width: "100%",
    alignItems: "center",
  },
  nicknameSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 16,
  },
  nickname: {
    fontSize: 20,
    fontWeight: "600",
    color: "#032B77",
  },
  infoContainer: {
    gap: 16,
    paddingHorizontal: 20,
    marginTop: 20,
    paddingBottom: 40,
  },
});
