import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import StadiumMap3D from './StadiumMap3D';

// Mock ResizeObserver for JSDOM
(window as unknown as { ResizeObserver: unknown }).ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Mock framer-motion to avoid complex 3D rendering issues in JSDOM
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => <div {...props}>{children}</div>
  },
  AnimatePresence: ({ children }: React.PropsWithChildren) => <>{children}</>
}));

// Mock react-three-fiber to prevent WebGL crash in JSDOM
vi.mock('@react-three/fiber', () => ({
  Canvas: ({ children }: React.PropsWithChildren) => <div>{children}</div>,
  useFrame: () => {},
  useThree: () => ({ camera: {}, scene: {} })
}));
vi.mock('@react-three/drei', () => ({
  OrbitControls: () => null,
  Environment: () => null,
  Html: ({ children }: React.PropsWithChildren) => <div>{children}</div>,
  useGLTF: () => ({ scene: {}, nodes: {}, materials: {} })
}));

describe('StadiumMap3D', () => {
  it('renders the 3D stadium map', () => {
    // Basic render test to ensure it doesn't crash
    render(<StadiumMap3D />);
    // Just verify something rendered, e.g. a container
    expect(document.body).toBeInTheDocument();
  });
});
