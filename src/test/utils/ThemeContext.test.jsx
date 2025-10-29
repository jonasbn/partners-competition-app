import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider } from '../../utils/ThemeContext';
import ThemeToggle from '../../components/ThemeToggle';

const TestComponent = () => {
  return (
    <ThemeProvider>
      <ThemeToggle />
      <div data-testid="theme-indicator">
        Theme test
      </div>
    </ThemeProvider>
  );
};

describe('Theme Context and Toggle', () => {
  it('renders theme toggle button', () => {
    render(<TestComponent />);
    
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });

  it('applies theme classes to body', () => {
    render(<TestComponent />);
    
    // Check that some theme class is applied to body
    const bodyClasses = document.body.className;
    expect(bodyClasses).toMatch(/theme|light|dark/);
  });

  it('toggles theme when button is clicked', () => {
    render(<TestComponent />);
    
    const button = screen.getByRole('button');
    const initialBodyClasses = document.body.className;
    
    fireEvent.click(button);
    
    const newBodyClasses = document.body.className;
    expect(newBodyClasses).not.toBe(initialBodyClasses);
  });
});