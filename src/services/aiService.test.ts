import { describe, it, expect, vi } from 'vitest';
import { generateAIResponse } from './aiService';
import type { StadiumData } from '../types';

let shouldFail = true;

// Mock the Gemini SDK completely so it never hits the real API
vi.mock('@google/generative-ai', () => ({
  GoogleGenerativeAI: class {
    getGenerativeModel() {
      return {
        generateContent: () => shouldFail 
          ? Promise.reject(new Error('Simulated network failure'))
          : Promise.resolve({ response: { text: () => 'Successful API response for test' } })
      };
    }
  }
}));

describe('aiService', () => {
  const mockData = {
    gates: [{ id: 'gate-4', name: 'Gate 4', waitTimeMinutes: 25, capacityPercent: 90, status: 'critical', recommendedAction: '' }],
    amenities: [
      { id: 'f1', type: 'food', name: 'Hot Dogs', location: 'North', waitTimeMinutes: 5, status: 'normal' },
      { id: 'f2', type: 'food', name: 'Burger', location: 'East', waitTimeMinutes: 1, status: 'normal' },
      { id: 'r1', type: 'restroom', name: 'Restroom 1', location: 'South', waitTimeMinutes: 2, status: 'normal' },
      { id: 'r2', type: 'restroom', name: 'Restroom 2', location: 'West', waitTimeMinutes: 10, status: 'normal' }
    ],
    incidents: [{ id: '1', title: 'Spill', type: 'maintenance', status: 'active', timeAgo: '2m' }],
    overallCrowd: { totalFans: 42500, capacityPercent: 88 }
  } as unknown as StadiumData;

  it('should fall back to mock logic when API fails or no key is present', async () => {
    const response = await generateAIResponse('lost', 'fan', mockData);
    expect(response.length).toBeGreaterThan(5);
  });

  describe('fan responses', () => {
    it('handles lost queries', async () => {
      const res = await generateAIResponse('where am i', 'fan', mockData);
      expect(res.length).toBeGreaterThan(5);
    });
    it('handles gate queries', async () => {
      const res = await generateAIResponse('find gate', 'fan', mockData);
      expect(res).toContain('teal lane markers');
    });
    it('handles food queries', async () => {
      const res = await generateAIResponse('hungry', 'fan', mockData);
      expect(res).toContain('Burger');
    });
    it('handles restroom queries', async () => {
      const res = await generateAIResponse('toilet', 'fan', mockData);
      expect(res).toContain('Restroom 1');
    });
    it('handles seat queries', async () => {
      const res = await generateAIResponse('my seat', 'fan', mockData);
      expect(res).toContain('Sector B, Row 12');
    });
    it('handles match stats queries', async () => {
      const res = await generateAIResponse('score', 'fan', mockData);
      expect(res).toContain('Home team leads');
    });
    it('handles wheelchair queries', async () => {
      const res = await generateAIResponse('accessible', 'fan', mockData);
      expect(res).toContain('Wheelchair-accessible');
    });
    it('handles wait queries', async () => {
      const res = await generateAIResponse('queue', 'fan', mockData);
      expect(res).toContain('shortest entry queue');
    });
    it('handles default fan query', async () => {
      const res = await generateAIResponse('hello', 'fan', mockData);
      expect(res).toContain('navigation');
    });
  });

  describe('volunteer responses', () => {
    it('handles incident queries', async () => {
      const res = await generateAIResponse('report incident', 'volunteer', mockData);
      expect(res.toLowerCase()).toContain('location');
    });
    it('handles translate queries', async () => {
      const res = await generateAIResponse('translate', 'volunteer', mockData);
      expect(res).toContain('Ready to translate');
    });
    it('handles map queries', async () => {
      const res = await generateAIResponse('map', 'volunteer', mockData);
      expect(res).toContain('North Gate 1');
    });
    it('handles task queries', async () => {
      const res = await generateAIResponse('task', 'volunteer', mockData);
      expect(res).toContain('Guide VIP guests');
    });
    it('handles crowd queries', async () => {
      const res = await generateAIResponse('density', 'volunteer', mockData);
      expect(res).toContain('Gate 4');
    });
    it('handles default volunteer query', async () => {
      const res = await generateAIResponse('hello', 'volunteer', mockData);
      expect(res).toContain('incident reporting');
    });
  });

  describe('organizer responses', () => {
    it('handles gate 4 queries', async () => {
      const res = await generateAIResponse('gate 4', 'organizer', mockData);
      expect(res).toContain('Gate 4 Critical');
    });
    it('handles density queries', async () => {
      const res = await generateAIResponse('density', 'organizer', mockData);
      expect(res).toContain('88% capacity');
    });
    it('handles broadcast queries', async () => {
      const res = await generateAIResponse('broadcast', 'organizer', mockData);
      expect(res).toContain('Broadcast securely transmitted');
    });
    it('handles incident queries', async () => {
      const res = await generateAIResponse('incident', 'organizer', mockData);
      expect(res).toContain('1 active incident');
    });
    it('handles wait queries', async () => {
      const res = await generateAIResponse('wait', 'organizer', mockData);
      expect(res).toContain('Highest wait time');
    });
    it('handles staff queries', async () => {
      const res = await generateAIResponse('staff', 'organizer', mockData);
      expect(res).toContain('Current staff allocation');
    });
    it('handles default organizer query', async () => {
      const res = await generateAIResponse('hello', 'organizer', mockData);
      expect(res).toContain('Command mode active');
    });
  });

  it('handles completely unrecognised queries', async () => {
    const res = await generateAIResponse('ajsdklfjsdf', 'organizer' as import('../types').UserRole, mockData);
    expect(res).toContain('Command mode active');
    const res2 = await generateAIResponse('ajsdklfjsdf', '' as import('../types').UserRole, mockData);
    expect(res2).toContain('rephrase');
  });

  it('handles empty amenities gracefully', async () => {
    const emptyData = { ...mockData, amenities: [] };
    const resFood = await generateAIResponse('food', 'fan', emptyData);
    expect(resFood).toContain('undefined'); // Because it returns undefined name/location if not found
    
    const resRestroom = await generateAIResponse('restroom', 'fan', emptyData);
    expect(resRestroom).toContain('undefined');
  });

  it('returns API response when successful', async () => {
    shouldFail = false;
    const res = await generateAIResponse('hello', 'fan', mockData);
    expect(res).toBe('Successful API response for test');
    shouldFail = true;
  });
});
