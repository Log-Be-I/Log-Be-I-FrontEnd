// components/sidebar/SidebarSlideOverlay.jsx
import {
  View,
  Animated,
  Dimensions,
  Pressable,
  StyleSheet,
  Easing,
} from "react-native"; // 기본 UI 컴포넌트 + 애니메이션
import { useEffect, useRef } from "react"; // 상태 및 애니메이션에 사용할 훅
import Sidebar from "./Sidebar"; // 우리가 만든 사이드바 본체

// 디바이스 전체 화면 크기 가져오기
const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;

export default function SidebarSlideOverlay({ visible, onClose }) {
  // 애니메이션 시작 위치를 화면 오른쪽 밖으로 설정
  const slideAnim = useRef(new Animated.Value(SCREEN_WIDTH)).current;

  // visible이 true/false로 바뀔 때마다 애니메이션 실행
  useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        // 🔽 열릴 때: 오른쪽 → 왼쪽 슬라이드 인
        toValue: 0, // 화면 왼쪽 0 위치까지 이동
        duration: 300, // 400ms 동안
        easing: Easing.out(Easing.ease), // 부드러운 감속 느낌
        useNativeDriver: false, // layout 관련 애니메이션은 false
      }).start();
    } else {
      // 🔼 닫힐 때: 왼쪽 → 오른쪽 슬라이드 아웃
      Animated.timing(slideAnim, {
        toValue: SCREEN_WIDTH, // 다시 오른쪽 바깥으로 이동
        duration: 800,
        useNativeDriver: false,
      }).start();
    }
  }, [visible]); // visible 상태가 바뀔 때마다 실행됨

  // 완전히 닫혀 있으면 아예 렌더링 안함
  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      {/* 반투명 뒷배경 - 누르면 onClose 실행 */}
      <Pressable style={styles.backdrop} onPress={onClose} />

      {/* 슬라이딩되는는 사이드바 */}
      <Animated.View
        style={[
          styles.sidebarWrapper,
          { transform: [{ translateX: slideAnim }] },
        ]}
      >
        <Sidebar onClose={onClose} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  // 전체 오버레이: 화면 전체를 덮음
  overlay: {
    position: "absolute", // 기존 레이아웃 위에 띄우기
    top: 0,
    left: 0,
    width: SCREEN_WIDTH, // 전체 화면 너비
    height: SCREEN_HEIGHT, // 전체 높이
    zIndex: 999, // 최상단
    flexDirection: "row", // 사이드바 + 배경 나란히 배치
  },
  // 배경 클릭 영역: 사이드바 외 영역
  backdrop: {
    flex: 1, // 나머지 영역 전체 차지
    backgroundColor: "rgba(0,0,0,0.3)", // 반투명 어두운 배경
  },
  // 실제 사이드바를 감싸는 컨테이너
  sidebarWrapper: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    backgroundColor: "#fff",
    position: "absolute",
    top: 0,
    right: 0,
    overflow: "hidden",
  },
});

// Modal은 slide의 방향이 아래에서 위이다.
// Modal은 방향제어가 제한적이기에 absolute + Animated로 직접 슬라이드 애니메이션을 넣자자
