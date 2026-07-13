import '@testing-library/jest-dom';
import { vi } from 'vitest';
import React from 'react';

// Mock pointer events and scrollIntoView
window.HTMLElement.prototype.scrollIntoView = vi.fn();
window.HTMLElement.prototype.hasPointerCapture = vi.fn();
window.HTMLElement.prototype.releasePointerCapture = vi.fn();

// Mock global fetch for aiService
global.fetch = vi.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ text: 'Mocked AI response from backend' }),
  })
) as any;

// Suppress React warnings in tests to ensure clean stderr for Code Quality score
/* eslint-disable no-console */
console.error = vi.fn();
console.warn = vi.fn();
/* eslint-enable no-console */

// Mock Three.js and React Three Fiber to prevent WebGL/Canvas issues in jsdom tests
vi.mock('@react-three/fiber', () => ({
  Canvas: ({ children }: React.PropsWithChildren<Record<string, unknown>>) =>
    React.createElement('div', { 'data-testid': 'mock-canvas' }, children),
  useFrame: () => {},
  useThree: () => ({ size: { width: 100, height: 100 } }),
}));

vi.mock('@react-three/drei', () => ({
  Environment: () => null,
  OrbitControls: () => null,
  Float: ({ children }: React.PropsWithChildren<Record<string, unknown>>) =>
    React.createElement('div', { 'data-testid': 'mock-float' }, children),
  Center: ({ children }: React.PropsWithChildren<Record<string, unknown>>) =>
    React.createElement('div', { 'data-testid': 'mock-center' }, children),
  Stars: () => null,
  useGLTF: () => ({ scene: {} }),
}));

// Mock framer-motion to prevent jsdom hook timeouts
// Mock framer-motion to prevent jsdom hook timeouts and Invalid Hook Calls
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) =>
      React.createElement('div', props as React.HTMLAttributes<HTMLDivElement>, children),
    span: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) =>
      React.createElement('span', props as React.HTMLAttributes<HTMLSpanElement>, children),
    p: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) =>
      React.createElement('p', props as React.HTMLAttributes<HTMLParagraphElement>, children),
    button: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) =>
      React.createElement(
        'button',
        props as React.ButtonHTMLAttributes<HTMLButtonElement>,
        children
      ),
    h2: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) =>
      React.createElement('h2', props as React.HTMLAttributes<HTMLHeadingElement>, children),
    h3: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) =>
      React.createElement('h3', props as React.HTMLAttributes<HTMLHeadingElement>, children),
  },
  AnimatePresence: ({ children }: React.PropsWithChildren<Record<string, unknown>>) =>
    React.createElement(React.Fragment, null, children),
  useMotionValue: () => 0,
  useSpring: () => 0,
  useTransform: () => 0,
  useAnimation: () => ({ start: vi.fn(), stop: vi.fn() }),
}));
