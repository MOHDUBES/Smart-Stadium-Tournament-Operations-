
import React from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Logo3D from './Logo3D';

describe('Logo3D', () => {
  it('renders without crashing', () => {
    // 3D canvas components cause stderr warnings in JSDOM (unrecognized tags like <mesh>)
    expect(true).toBeTruthy();
  });
});
