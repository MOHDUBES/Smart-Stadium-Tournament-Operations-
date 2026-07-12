import '@testing-library/jest-dom';
import { vi } from 'vitest';
import React from 'react';

// Mock Three.js and React Three Fiber to prevent WebGL/Canvas issues in jsdom tests
vi.mock('@react-three/fiber', () => ({
  Canvas: ({ children }: Record<string, unknown>) => React.createElement('div', { 'data-testid': 'mock-canvas' }, children),
  useFrame: () => {},
  useThree: () => ({ size: { width: 100, height: 100 } }),
}));

vi.mock('@react-three/drei', () => ({
  Environment: () => null,
  OrbitControls: () => null,
  Float: ({ children }: Record<string, unknown>) => React.createElement('div', { 'data-testid': 'mock-float' }, children),
  Center: ({ children }: Record<string, unknown>) => React.createElement('div', { 'data-testid': 'mock-center' }, children),
  Stars: () => null,
  useGLTF: () => ({ scene: {} }),
}));

// Mock framer-motion to prevent jsdom hook timeouts
vi.mock('framer-motion', () => {
  const actual = vi.importActual('framer-motion');
  return {
    ...actual,
    motion: {
      div: ({ children, ...props }: Record<string, unknown>) => React.createElement('div', props, children),
      span: ({ children, ...props }: Record<string, unknown>) => React.createElement('span', props, children),
      p: ({ children, ...props }: Record<string, unknown>) => React.createElement('p', props, children),
      button: ({ children, ...props }: Record<string, unknown>) => React.createElement('button', props, children),
    },
    AnimatePresence: ({ children }: Record<string, unknown>) => React.createElement(React.Fragment, null, children),
    useMotionValue: () => 0,
    useSpring: () => 0,
    useTransform: () => 0,
    useAnimation: () => ({ start: vi.fn(), stop: vi.fn() })
  };
});
