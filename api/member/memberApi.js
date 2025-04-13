// 회원 관련 API 
import axiosInstance from '../axiosInstance';

//회원 정보 수정 (Patch)
export const patchMemberInfo = async (memberId, { nickname, profile, region }, token) => {
    const res = await axiosInstance.patch(
        `/members/${memberId}`,
        { nickname, profile, region },
        { 
            headers: { 
                Authorization: `Bearer ${token}` 
            } 
        }
    );
    return res.data;
};

// 로그아웃
export const logout = async (token) => {
    const res = await axiosInstance.post(
        '/auth/logout', 
        {}, 
        {
            headers: { Authorization: `Bearer ${token}` }
        }
    );
    return res.data;
};

// // 회원 정보 조회 (Get)
// export const getMemebrInfo = async (memberId, token) => {
//     const res = await axios.get(
//         `/members/${memberId}`,
//         { 
//             headers: 
//             { 
//                 Authorization: `Bearer ${token}` 
//             } 
//         }
//     );
//     return res.data;
// };
