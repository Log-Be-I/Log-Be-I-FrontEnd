import { View, StyleSheet, Text, Pressable, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useUserStore } from '../store/useUserStore';
import TextComponent from "../components/onBoard/text";
import ProfileIcon from '../assets/sidebar/sidebarProfile/aegiRogiProfile.svg';
import EmailIcon from '../assets/sidebar/sidebarProfile/caseIcon.svg';
import LocationIcon from '../assets/sidebar/sidebarProfile/locationIcon.svg';
import BirthIcon from '../assets/images/birthDay.svg';
import PencilIcon from '../assets/sidebar/sidebarProfile/pencil.svg';
import UserIcon from '../assets/sidebar/sidebarProfile/userIcon.svg';

export default function MemberInfo() {
  const router = useRouter();
  const { nickname, email, name, birth, region } = useUserStore();

  const handleEditPress = () => {
    router.push("/Profile/edit");
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBackground} />
      <View style={styles.bottomBackground} />
      
      <SafeAreaView style={styles.content}>
        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.profileSection}>
            <View style={styles.profileDiamond}>
              <View style={styles.profileCircle}>
                <ProfileIcon width={70} height={70} />
              </View>
            </View>
          </View>

          <View style={styles.nicknameContainer}>
            <View style={styles.nicknameSection}>
              <Text style={styles.nickname}>애기로기{nickname}</Text>
              <Pressable onPress={handleEditPress}>
                <PencilIcon width={24} height={24} />
              </Pressable>
            </View>
          </View>

          <View style={styles.infoContainer}>
            <TextComponent
              value="aegirogi@gmail.com" /*{email}*/
              iconComponent={<EmailIcon width={20} height={20}/>}
              editable={false}
              textColor="#032B77"
            />

            <TextComponent
              value= "기록기" /*{name}*/
              iconComponent={<UserIcon width={20} height={20}/>}
              editable={false}
              textColor="#032B77"
            />

            <TextComponent
              value= "1999-12-21"/*{birth}*/
              iconComponent={<BirthIcon width={20} height={20}/>}
              editable={false}
              textColor="#032B77"
            />

            <TextComponent
              value="서울특별시 강남구"/*{region}*/
              iconComponent={<LocationIcon width={20} height={20}/>}
              editable={false}
              textColor="#032B77"
            />
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
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '30%',
    backgroundColor: 'rgba(105, 186, 255, 0.3)',
  },
  bottomBackground: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '78%',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 30,
  },
  content: {
    flex: 1,
    zIndex: 1,
  },
  scrollView: {
    flex: 1,
  },
  profileSection: {
    alignItems: 'center',
    marginTop: '25%',
  },
  profileDiamond: {
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
  profileCircle: {
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
  nicknameContainer: {
    width: '100%',
    alignItems: 'center',
  },
  nicknameSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 16,
  },
  nickname: {
    fontSize: 20,
    fontWeight: '600',
    color: '#032B77',
  },
  infoContainer: {
    gap: 16,
    paddingHorizontal: 20,
    marginTop: 20,
    paddingBottom: 40,
  },
}); 