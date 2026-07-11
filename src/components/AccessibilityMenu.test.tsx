import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import AccessibilityMenu from './AccessibilityMenu';
import { useAppStore } from '../store/useStore';

describe('AccessibilityMenu', () => {
  beforeEach(() => {
    // Reset state before each test
    useAppStore.setState({
      language: 'en',
      highContrast: false,
      fontSize: 'normal'
    });
  });

  it('renders the floating action button', () => {
    render(<AccessibilityMenu />);
    expect(screen.getByRole('button', { name: /settings/i })).toBeInTheDocument();
  });

  it('toggles menu open and closed', () => {
    render(<AccessibilityMenu />);
    const mainButton = screen.getByRole('button', { name: /settings/i });
    
    // Initially closed
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    
    // Open menu
    fireEvent.click(mainButton);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    
    // Close menu
    fireEvent.click(mainButton);
  });

  it('toggles high contrast mode', () => {
    render(<AccessibilityMenu />);
    fireEvent.click(screen.getByRole('button', { name: /settings/i })); // Open menu
    
    const contrastBtn = screen.getByText(/High Contrast/i).closest('button');
    fireEvent.click(contrastBtn!);
    
    expect(useAppStore.getState().highContrast).toBe(true);
    
    fireEvent.click(contrastBtn!);
    expect(useAppStore.getState().highContrast).toBe(false);
  });

  it('toggles large text mode', () => {
    render(<AccessibilityMenu />);
    fireEvent.click(screen.getByRole('button', { name: /settings/i }));
    
    const textBtn = screen.getByText(/Large Text/i).closest('button');
    fireEvent.click(textBtn!);
    
    expect(useAppStore.getState().fontSize).toBe('large');
    
    fireEvent.click(textBtn!);
    expect(useAppStore.getState().fontSize).toBe('normal');
  });

  it('changes language', () => {
    render(<AccessibilityMenu />);
    fireEvent.click(screen.getByRole('button', { name: /settings/i }));
    
    const esBtn = screen.getByText('ES');
    fireEvent.click(esBtn);
    expect(useAppStore.getState().language).toBe('es');
    
    const arBtn = screen.getByText('AR');
    fireEvent.click(arBtn);
    expect(useAppStore.getState().language).toBe('ar');
    
    const enBtn = screen.getByText('EN');
    fireEvent.click(enBtn);
    expect(useAppStore.getState().language).toBe('en');
  });
});
