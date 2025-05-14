import { Text, View, StyleSheet, Pressable } from "react-native";
import { useState, useEffect } from "react";

export default function Pagination({ currentPage, totalPages, onPageChange }) {
    const pagesPerGroup = 5;
    const totalGroups = Math.ceil(totalPages / pagesPerGroup);
    //currentPage에 따라 그룹 인덱스를 재설정정
    const [groupIndex, setGroupIndex] = useState(Math.floor((currentPage - 1) / pagesPerGroup));

    useEffect(() => {
      setGroupIndex(Math.floor((currentPage - 1) / pagesPerGroup));
  }, [currentPage]);

    const startPage = groupIndex * pagesPerGroup + 1;
    const endPage = Math.min(startPage + pagesPerGroup - 1, totalPages);
  
    const handlePrevGroup = () => {
      if (groupIndex > 0) {
        const newGroupIndex = groupIndex - 1;
        setGroupIndex(newGroupIndex);
        const newPage = newGroupIndex * pagesPerGroup + 1;
        onPageChange(newPage); // 첫 페이지로 이동
      }
    };
  
    const handleNextGroup = () => {
      if (groupIndex < totalGroups - 1) {
        const newGroupIndex = groupIndex + 1;
        setGroupIndex(newGroupIndex);
        const newPage = newGroupIndex * pagesPerGroup + 1;
        onPageChange(newPage); // 첫 페이지로 이동
      }
    };
  
    const pageButtons = [];
    for (let i = startPage; i <= endPage; i++) {
      pageButtons.push(
        <Pressable key={i} onPress={() => onPageChange(i)}>
          {i === currentPage ? (
            <View
              colors={'#82ACF1'}
              style={styles.pageButtonActive}
            >
              <Text style={styles.pageTextActive}>{i}</Text>
            </View>
          ) : (
            <View style={styles.pageButton}>
              <Text style={styles.pageText}>{i}</Text>
            </View>
          )}
        </Pressable>
      );
    }
  
    return (
      <View style={styles.paginationContainer}>
        <Pressable 
        onPress={handlePrevGroup} 
        disabled={groupIndex === 0} 
        style={styles.arrowButton}
        >
          <Text style={groupIndex === 0 ? styles.disabledText : styles.pageText}>‹</Text>
        </Pressable>

        {/* 페이지 버튼은 항상 표시 */}
        {pageButtons.length > 0 ? pageButtons : (
          <View style={styles.pageButtonActive}>
            <Text style={styles.pageTextActive}>1</Text>
          </View>
        )}
        
        <Pressable 
        onPress={handleNextGroup} 
        disabled={groupIndex >= totalGroups - 1} 
        style={styles.arrowButton}
        >
          <Text style={groupIndex >= totalGroups - 1 ? styles.disabledText : styles.pageText}>›</Text>
        </Pressable>
      </View>
    );
  }

  const styles = StyleSheet.create({
    paginationContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        gap: 8,
        backgroundColor: 'white',
      },
      
      arrowButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 10,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 3, //  Android 그림자
      },
      
      pageButton: {
        width: 35,
        height: 35,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: '#ccc',
        borderWidth: 1,
        backgroundColor: 'white',
      },
      
      pageButtonActive: {
        width: 35,
        height: 35,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ADD8E6', // 파스텔 톤 파란색 (Light Blue)
      },
      // 화살표 텍스트 색상: 남색으로 고정
      arrowText: {
        color: '#1E3A8A', // 진한 남색 (Tailwind 기준 navy-800)
        fontWeight: 'bold',
      },
      
      pageText: {
        color: '#333',
      },
      
      pageTextActive: {
        color: 'white',
        fontWeight: 'bold',
      },
      // 화살표 비활성화 텍스트 색상: 회색으로 고정
      disabledText: {
        color: '#aaa',
      },      
  })