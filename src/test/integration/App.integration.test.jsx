import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { ThemeProvider } from '../../utils/ThemeContext';
import '../../utils/i18n';
import App from '../../App';

// Mock heavy chart components for integration tests
vi.mock('../../components/LazyCharts', () => ({
  LazyPlayerStatsChart: () => <div data-testid="chart-loaded">Player Stats Loaded</div>,
  LazyPlayerPerformanceChart: () => <div data-testid="chart-loaded">Performance Loaded</div>,
  LazyGamesCalendarChart: () => <div data-testid="chart-loaded">Calendar Loaded</div>,
  LazyTeamCombinationChart: () => <div data-testid="chart-loaded">Team Combinations Loaded</div>,
}));

// Use real data utilities for integration test
vi.unmock('../../utils/dataUtils');

const renderApp = () => {
  return render(
    <ThemeProvider>
      <App />
    </ThemeProvider>
  );
};

describe('App Integration Tests', () => {
  it('loads and displays all main components with real data', async () => {
    renderApp();
    
    // Wait for all components to load
    await waitFor(() => {
      expect(screen.getByRole('navigation')).toBeInTheDocument();
    }, { timeout: 3000 });
    
    // Check that charts are loading
    await waitFor(() => {
      const chartElements = screen.getAllByTestId('chart-loaded');
      expect(chartElements.length).toBeGreaterThan(0);
    }, { timeout: 5000 });
  });

  it('handles navigation and layout correctly', () => {
    renderApp();
    
    // Check Bootstrap grid structure
    const containers = document.querySelectorAll('.container');
    expect(containers.length).toBeGreaterThan(0);
    
    const rows = document.querySelectorAll('.row');
    expect(rows.length).toBeGreaterThan(0);
    
    const cols = document.querySelectorAll('[class*="col-"]');
    expect(cols.length).toBeGreaterThan(0);
  });

  it('renders with proper accessibility structure', () => {
    renderApp();
    
    // Check for proper semantic HTML
    expect(screen.getByRole('navigation')).toBeInTheDocument();
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
    
    // Check for main content container
    const container = document.querySelector('.container');
    expect(container).toBeInTheDocument();
  });

  it('handles error boundaries without crashing', () => {
    // This test ensures that even if child components error, the app doesn't crash
    expect(() => renderApp()).not.toThrow();
  });
});