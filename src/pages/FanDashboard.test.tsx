
import React from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import FanDashboard from './FanDashboard';

describe('FanDashboard', () => {
  it('renders without crashing', () => {
    const { container } = render(
      <MemoryRouter>
        <FanDashboard />
      </MemoryRouter>
    );
    expect(container).toBeTruthy();
  });
});
