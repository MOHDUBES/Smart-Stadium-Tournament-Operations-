import { create } from 'zustand';
import type { UserRole, SupportedLanguage, FontSize, StadiumData, VolunteerTask } from '../types';
import { mockStadiumData, volunteerTasks } from '../data/mockData';

interface AppState {
  role: UserRole;
  setRole: (role: UserRole) => void;

  // Accessibility
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  highContrast: boolean;
  setHighContrast: (val: boolean) => void;
  fontSize: FontSize;
  setFontSize: (val: FontSize) => void;

  stadiumData: StadiumData;
  tasks: VolunteerTask[];

  toggleTask: (taskId: string) => void;
  addIncident: (title: string, type: string) => void;
  tickLiveSimulation: () => void;
  externalChatQuery: string | null;
  setExternalChatQuery: (query: string | null) => void;
}

export const useAppStore = create<AppState>((set) => ({
  role: (localStorage.getItem('pitchmind_role') as UserRole) || null,
  setRole: (role) => {
    if (role) {
      localStorage.setItem('pitchmind_role', role);
    } else {
      localStorage.removeItem('pitchmind_role');
    }
    set({ role });
  },

  language: (localStorage.getItem('pitchmind_lang') as SupportedLanguage) || 'en',
  setLanguage: (language) => {
    localStorage.setItem('pitchmind_lang', language);
    set({ language });
  },

  highContrast: localStorage.getItem('pitchmind_hc') === 'true',
  setHighContrast: (highContrast) => {
    localStorage.setItem('pitchmind_hc', String(highContrast));
    set({ highContrast });
  },

  fontSize: (localStorage.getItem('pitchmind_fs') as FontSize) || 'normal',
  setFontSize: (fontSize) => {
    localStorage.setItem('pitchmind_fs', fontSize);
    set({ fontSize });
  },

  stadiumData: mockStadiumData,
  tasks: volunteerTasks,

  toggleTask: (taskId) =>
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t)),
    })),

  addIncident: (title, type) =>
    set((state) => ({
      stadiumData: {
        ...state.stadiumData,
        incidents: [
          { id: Date.now().toString(), title, type, status: 'active', timeAgo: 'Just now' },
          ...state.stadiumData.incidents,
        ],
      },
    })),

  tickLiveSimulation: () =>
    set((state) => {
      const newGates = state.stadiumData.gates.map((gate) => ({
        ...gate,
        waitTimeMinutes: Math.max(0, gate.waitTimeMinutes + (Math.floor(Math.random() * 3) - 1)),
      }));
      return { stadiumData: { ...state.stadiumData, gates: newGates } };
    }),

  externalChatQuery: null,
  setExternalChatQuery: (query) => set({ externalChatQuery: query }),
}));
