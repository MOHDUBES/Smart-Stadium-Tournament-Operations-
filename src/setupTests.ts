import '@testing-library/jest-dom';
import { vi } from 'vitest';
import React from 'react';

// Mock Three.js and React Three Fiber to prevent WebGL/Canvas issues in jsdom tests
vi.mock('@react-three/fiber', () => ({
  Canvas: ({ children }: any) => React.createElement('div', { 'data-testid': 'mock-canvas' }, children),
  useFrame: () => {},
  useThree: () => ({ size: { width: 100, height: 100 } }),
}));

vi.mock('@react-three/drei', () => ({
  Environment: () => null,
  OrbitControls: () => null,
  Float: ({ children }: any) => React.createElement('div', { 'data-testid': 'mock-float' }, children),
  Center: ({ children }: any) => React.createElement('div', { 'data-testid': 'mock-center' }, children),
  Stars: () => null,
  useGLTF: () => ({ scene: {} }),
}));
