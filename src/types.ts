// ─── Core Role & Language Types ───────────────────────────────────────────────
export type UserRole = 'fan' | 'volunteer' | 'organizer' | null;
export type SupportedLanguage = 'en' | 'es' | 'ar';
export type FontSize = 'normal' | 'large';
export type IncidentStatus = 'active' | 'resolved';
export type IncidentType = 'maintenance' | 'medical' | 'security' | 'other';
export type AmenityType = 'food' | 'restroom' | 'merchandise' | 'medical';

// ─── Stadium Data Shapes ───────────────────────────────────────────────────────
export interface Gate {
  id: string;
  name: string;
  waitTimeMinutes: number;
  capacityPercent: number;
}

export interface Amenity {
  id: string;
  name: string;
  type: AmenityType;
  waitTimeMinutes: number;
  location: string;
}

export interface Incident {
  id: string;
  title: string;
  status: IncidentStatus;
  timeAgo: string;
  type: IncidentType | string; // string allows legacy/dynamic types
}

export interface OverallCrowd {
  totalFans: number;
  capacityPercent: number;
}

export interface StadiumData {
  gates: Gate[];
  amenities: Amenity[];
  incidents: Incident[];
  overallCrowd: OverallCrowd;
}

// ─── Chat / AI ────────────────────────────────────────────────────────────────
export interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: Date;
}

// ─── Volunteer Tasks ──────────────────────────────────────────────────────────
export interface VolunteerTask {
  id: string;
  text: string;
  completed: boolean;
}
