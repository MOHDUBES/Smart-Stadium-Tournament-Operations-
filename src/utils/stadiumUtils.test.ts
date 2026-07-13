import { describe, it, expect } from 'vitest';
import { getWorstWaitTimeGate, getCapacityColor } from './stadiumUtils';
import type { Gate } from './stadiumUtils';

describe('stadiumUtils', () => {
  describe('getWorstWaitTimeGate', () => {
    it('returns the gate with the highest wait time', () => {
      const mockGates: Gate[] = [
        { id: '1', name: 'Gate 1', waitTimeMinutes: 10, capacityPercent: 30 },
        { id: '2', name: 'Gate 2', waitTimeMinutes: 45, capacityPercent: 90 },
        { id: '3', name: 'Gate 3', waitTimeMinutes: 5, capacityPercent: 10 },
      ];

      const worst = getWorstWaitTimeGate(mockGates);
      expect(worst?.id).toBe('2');
    });

    it('returns undefined for empty arrays', () => {
      expect(getWorstWaitTimeGate([])).toBeUndefined();
    });
  });

  describe('getCapacityColor', () => {
    it('returns green for low capacity', () => {
      expect(getCapacityColor(30)).toBe('#7ED957');
    });

    it('returns amber for medium capacity', () => {
      expect(getCapacityColor(60)).toBe('#f59e0b');
    });

    it('returns red for high capacity', () => {
      expect(getCapacityColor(90)).toBe('#ef4444');
    });
  });
});
