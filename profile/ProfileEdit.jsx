import { View, StyleSheet, Text, Pressable, ScrollView, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useState, useRef } from "react";
import { useUserStore } from '../store/useUserStore';
import TextComponent from "../components/onBoard/text";
import { RegionDropdown } from "../components/common/RegionDropdown";
import ProfileIcon from '../assets/sidebar/sidebarProfile/aegiRogiProfile.svg';
import CameraIcon from '../assets/sidebar/sidebarProfile/cameraIcon.svg';
import EmailIcon from '../assets/sidebar/sidebarProfile/caseIcon.svg';
import BirthIcon from '../assets/images/birthDay.svg';
import { patchMemberInfo } from '../api/member/memberApi';

export default function ProfileEdit() {
  const router = useRouter();
  const scrollViewRef = useRef(null);
  const { memberId, token, nickname, email, name, birth, region } = useUserStore();
  const [nicknameInput, setNicknameInput] = useState(nickname);
  const [selectedCity, setSelectedCity] = useState(region?.split(' ')[0] || '');
  const [selectedDistrict, setSelectedDistrict] = useState(region?.split(' ')[1] || '');
  const [showCityDropdown, setShowCityDropdown] = useState(false);


  const handleSave = async () => {
    try {
      if (!nicknameInput.trim()) return;
      
      const newRegion = selectedCity && selectedDistrict 
        ? `${selectedCity} ${selectedDistrict}`
        : region;

      await patchMemberInfo(memberId, {
        nickname: nicknameInput,
        profile: '',
        region: newRegion
      }, token);

      router.back();
    } catch (error) {
      console.error('회원 정보 수정 실패:', error);
    }
  };

  const cityDropdownRef = useRef(null);
  const districtDropdownRef = useRef(null);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.buttonText}>Save</Text>
        </Pressable>
        <Pressable style={styles.cancelButton} onPress={() => router.back()}>
          <Text style={[styles.buttonText, styles.cancelText]}>Cancel</Text>
        </Pressable>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}
      >
        <View style={styles.backgroundContainer} />
        
        <View style={styles.bottomBackground}>
          <View style={styles.profileSection}>
            <View style={styles.profileWrapper}>
              <View style={styles.profileInner}>
                <ProfileIcon width={70} height={70} />
              </View>
            </View>
            <View style={styles.cameraIcon}>
              <CameraIcon width={24} height={24} />
            </View>
          </View>

          <View style={styles.infoSection}>
            <View style={styles.nicknameContainer}>
              <TextInput
                style={styles.nicknameInput}
                value={nicknameInput}
                onChangeText={setNicknameInput}
                placeholder="애기로기"/*{nickname}*/
              />
            </View>

            <View style={styles.infoList}>
              <TextComponent
                value="aegirogi@gmail.com" /*{email}*/
                iconComponent={<EmailIcon width={20} height={20}/>}
                editable={false}
                textColor="#032B77"
              />
              <TextComponent
                value="기록기" /*{name}*/
                iconName="person"
                editable={false}
                textColor="#032B77"
              />
              <TextComponent
                value="1999-12-21"/*{birth}*/
                iconComponent={<BirthIcon width={20} height={20}/>}
                editable={false}
                textColor="#032B77"
              />
            </View>

            <RegionDropdown />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    padding: 16,
    backgroundColor: 'rgba(105, 186, 255, 0.3)',
    paddingTop: 30,
  },
  saveButton: {
    backgroundColor: '#69BAFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  cancelButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#FF7777',
  },
  buttonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  cancelText: {
    color: '#FF7777',
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: 200,
  },
  backgroundContainer: {
    width: '100%',
    height: 110,
    backgroundColor: 'rgba(105, 186, 255, 0.3)',
  },
  bottomBackground: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 30,
    marginTop: -30,
  },
  profileSection: {
    alignItems: 'center',
    marginTop: -60,
    marginBottom: 20,
    position: 'relative',
  },
  profileWrapper: {
    width: 120,
    height: 120,
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#F0F4FA',
    transform: [{ rotate: '45deg' }],
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInner: {
    width: 110,
    height: 110,
    borderRadius: 70,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#F0F4FA',
    transform: [{ rotate: '-45deg' }],
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraIcon: {
    position: 'absolute',
    bottom: -8,
    backgroundColor: '#FFFFFF',
    padding: 4,
    borderRadius: 12,
  },
  infoSection: {
    padding: 20,
    gap: 20,
  },
  nicknameContainer: {
    width: '100%',
    alignItems: 'center',
  },
  nicknameInput: {
    width: '50%',
    fontSize: 20,
    fontWeight: '600',
    color: '#032B77',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
    textAlign: 'center',
    borderWidth: 1,
    borderColor: '#F0F4FA',
  },
  infoList: {
    gap: 20,
  },
  regionContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  regionItem: {
    flex: 1,
  },
}); 