import { create } from 'zustand';

export const useUserStore = create((set) => ({
    email: '',
    name:'',
    birth:'',
    region:'',
    nickname:'',
    memberId:'',
    token:'',

    // 전체 유저 정보 한번에 세팅
    setUserInfo: (userInfo) => set({...userInfo}),

    // 닉네임만 수정할 때
    updateNickname: (nickname) => set({nickname}),

    // 지역 정보만 수정할 때
    updateRegion: (region) => set({region}),

    //로그아웃
    clearUserInfo: () => set({
        email: '',
        name:'',
        birth:'',
        region:'',
        nickname:'',
        memberId:'',
        token:'',
    }),
}));
