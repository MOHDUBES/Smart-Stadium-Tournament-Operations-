import type { StadiumData, VolunteerTask } from '../types';

export const mockStadiumData: StadiumData = {
  gates: [
    { id: 'gate-1', name: 'Gate 1 (North)', waitTimeMinutes: 5, capacityPercent: 45 },
    { id: 'gate-2', name: 'Gate 2 (East)', waitTimeMinutes: 12, capacityPercent: 82 },
    { id: 'gate-3', name: 'Gate 3 (South)', waitTimeMinutes: 3, capacityPercent: 30 },
    { id: 'gate-4', name: 'Gate 4 (West)', waitTimeMinutes: 25, capacityPercent: 95 },
  ],
  amenities: [
    {
      id: 'food-1',
      name: 'Classic Burgers',
      type: 'food',
      waitTimeMinutes: 15,
      location: 'Near Gate 3',
    },
    {
      id: 'food-2',
      name: 'Vegan Delights',
      type: 'food',
      waitTimeMinutes: 2,
      location: 'Near Gate 1',
    },
    {
      id: 'rest-1',
      name: 'Restroom (Sector 4)',
      type: 'restroom',
      waitTimeMinutes: 8,
      location: 'Sector 4 Concourse',
    },
    {
      id: 'rest-2',
      name: 'Restroom (VIP)',
      type: 'restroom',
      waitTimeMinutes: 0,
      location: 'Sector 1',
    },
  ],
  incidents: [
    {
      id: 'inc-1',
      title: 'Spill on Concourse B',
      status: 'active',
      timeAgo: '10m',
      type: 'maintenance',
    },
    {
      id: 'inc-2',
      title: 'Medical Assist (Sect 2)',
      status: 'resolved',
      timeAgo: '1h',
      type: 'medical',
    },
  ],
  overallCrowd: {
    totalFans: 42500,
    capacityPercent: 85,
  },
};

export const volunteerTasks: VolunteerTask[] = [
  { id: 't1', text: 'Verify Gate 4 turnstiles', completed: true },
  { id: 't2', text: 'Guide VIP guests to Sector 2', completed: false },
  { id: 't3', text: 'Check restroom supplies (North-East)', completed: false },
];
