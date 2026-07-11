import { describe, it, expect, beforeEach } from 'vitest';
import { useAppStore } from './useStore';
import type { StadiumData } from '../types';

describe('useAppStore', () => {
  beforeEach(() => {
    // Reset Zustand store state and localStorage before each test
    localStorage.clear();
    useAppStore.setState({
      role: null,
      language: 'en',
      highContrast: false,
      fontSize: 'normal',
      tasks: [
        { id: '1', text: 'Task 1', completed: false },
        { id: '2', text: 'Task 2', completed: false }
      ],
      stadiumData: {
        crowdDensity: 50,
        gates: [{ id: 'g1', name: 'Gate 1', waitTimeMinutes: 5, status: 'normal' }],
        incidents: []
      } as unknown as StadiumData,
      externalChatQuery: null
    });
  });

  it('should initialize with default values', () => {
    const state = useAppStore.getState();
    expect(state.role).toBeNull();
    expect(state.language).toBe('en');
    expect(state.highContrast).toBe(false);
    expect(state.fontSize).toBe('normal');
    expect(state.externalChatQuery).toBeNull();
  });

  it('should set and clear role', () => {
    useAppStore.getState().setRole('fan');
    expect(useAppStore.getState().role).toBe('fan');
    expect(localStorage.getItem('pitchmind_role')).toBe('fan');

    useAppStore.getState().setRole(null);
    expect(useAppStore.getState().role).toBeNull();
    expect(localStorage.getItem('pitchmind_role')).toBeNull();
  });

  it('should set language', () => {
    useAppStore.getState().setLanguage('es');
    expect(useAppStore.getState().language).toBe('es');
    expect(localStorage.getItem('pitchmind_lang')).toBe('es');
  });

  it('should set high contrast', () => {
    useAppStore.getState().setHighContrast(true);
    expect(useAppStore.getState().highContrast).toBe(true);
    expect(localStorage.getItem('pitchmind_hc')).toBe('true');
  });

  it('should set font size', () => {
    useAppStore.getState().setFontSize('large');
    expect(useAppStore.getState().fontSize).toBe('large');
    expect(localStorage.getItem('pitchmind_fs')).toBe('large');
  });

  it('should toggle task completion', () => {
    useAppStore.getState().toggleTask('1');
    expect(useAppStore.getState().tasks[0].completed).toBe(true);

    useAppStore.getState().toggleTask('1');
    expect(useAppStore.getState().tasks[0].completed).toBe(false);
  });

  it('should add an incident', () => {
    useAppStore.getState().addIncident('Test Incident', 'security');
    const incidents = useAppStore.getState().stadiumData.incidents;
    expect(incidents.length).toBe(1);
    expect(incidents[0].title).toBe('Test Incident');
    expect(incidents[0].type).toBe('security');
    expect(incidents[0].status).toBe('active');
  });

  it('should tick live simulation', () => {
    // Initial wait time is 5
    // Random fluctuation is Math.floor(Math.random() * 3) - 1 => -1, 0, or 1
    // The wait time should be between 4 and 6
    useAppStore.getState().tickLiveSimulation();
    const waitTime = useAppStore.getState().stadiumData.gates[0].waitTimeMinutes;
    expect(waitTime).toBeGreaterThanOrEqual(4);
    expect(waitTime).toBeLessThanOrEqual(6);
  });

  it('should set external chat query', () => {
    useAppStore.getState().setExternalChatQuery('hello');
    expect(useAppStore.getState().externalChatQuery).toBe('hello');
  });
});
