import { create } from "zustand";

const useAudioStore = create((set, get) => ({
  // 상태
  isPlaying: false,
  currentSound: null,
  selectedReports: [],
  playAll: false,
  currentReportId: null,
  progress: 0,

  // 액션
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  setCurrentSound: (sound) => set({ currentSound: sound }),
  setSelectedReports: (reports) => set({ selectedReports: reports }),
  setPlayAll: (playAll) => set({ playAll }),
  setCurrentReportId: (reportId) => set({ currentReportId: reportId }),
  setProgress: (progress) => set({ progress }),

  // 복합 액션
  startPlaying: (reportId) => {
    set({
      isPlaying: true,
      currentReportId: reportId,
      progress: 0,
    });
  },

  stopPlaying: () => {
    const { currentSound } = get();
    if (currentSound) {
      currentSound.stopAsync();
      currentSound.unloadAsync();
    }
    set({
      isPlaying: false,
      currentSound: null,
      currentReportId: null,
      progress: 0,
    });
  },

  toggleReportSelection: (reportId) => {
    const { selectedReports } = get();
    set({
      selectedReports: selectedReports.includes(reportId)
        ? selectedReports.filter((id) => id !== reportId)
        : [...selectedReports, reportId],
    });
  },

  clearSelection: () => {
    set({
      selectedReports: [],
      playAll: false,
    });
  },
}));

export default useAudioStore;
