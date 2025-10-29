import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { ThemeProvider } from '../utils/ThemeContext';
import '../utils/i18n'; // Initialize i18n
import App from '../App';

// Mock the chart components to avoid complex rendering issues
vi.mock('../components/LazyCharts', () => ({
  LazyPlayerStatsChart: () => <div data-testid="player-stats-chart">Player Stats Chart</div>,
  LazyPlayerPerformanceChart: () => <div data-testid="player-performance-chart">Player Performance Chart</div>,
  LazyGamesCalendarChart: () => <div data-testid="games-calendar-chart">Games Calendar Chart</div>,
  LazyTeamCombinationChart: () => <div data-testid="team-combination-chart">Team Combination Chart</div>,
}));

// Mock individual components
vi.mock('../components/Leaderboard', () => ({
  default: () => <div data-testid="leaderboard">Leaderboard</div>
}));

vi.mock('../components/GamesList', () => ({
  default: () => <div data-testid="games-list">Games List</div>
}));

vi.mock('../components/TeamStatistics', () => ({
  default: () => <div data-testid="team-statistics">Team Statistics</div>
}));

vi.mock('../components/SummaryCards', () => ({
  default: () => <div data-testid="summary-cards">Summary Cards</div>
}));

vi.mock('../components/ThemeToggle', () => ({
  default: () => <button data-testid="theme-toggle">Theme Toggle</button>
}));

vi.mock('../components/LanguageSelector', () => ({
  default: () => <select data-testid="language-selector"><option>EN</option></select>
}));

const renderWithProviders = (component) => {
  return render(
    <ThemeProvider>
      {component}
    </ThemeProvider>
  );
};

describe('App Component', () => {
  it('renders without crashing', () => {
    renderWithProviders(<App />);
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('renders all main sections', async () => {
    renderWithProviders(<App />);
    
    // Wait for components to load
    await waitFor(() => {
      expect(screen.getByTestId('summary-cards')).toBeInTheDocument();
      expect(screen.getByTestId('leaderboard')).toBeInTheDocument();
      expect(screen.getByTestId('team-statistics')).toBeInTheDocument();
      expect(screen.getByTestId('games-list')).toBeInTheDocument();
    });
  });

  it('renders navigation controls', () => {
    renderWithProviders(<App />);
    
    expect(screen.getByTestId('theme-toggle')).toBeInTheDocument();
    expect(screen.getByTestId('language-selector')).toBeInTheDocument();
  });

  it('renders chart components', async () => {
    renderWithProviders(<App />);
    
    await waitFor(() => {
      expect(screen.getByTestId('player-stats-chart')).toBeInTheDocument();
      expect(screen.getByTestId('player-performance-chart')).toBeInTheDocument();
      expect(screen.getByTestId('games-calendar-chart')).toBeInTheDocument();
      expect(screen.getByTestId('team-combination-chart')).toBeInTheDocument();
    });
  });

  it('has proper Bootstrap grid structure', () => {
    renderWithProviders(<App />);
    
    const containers = screen.getAllByTestId(/.*/, { selector: '.container' });
    expect(containers.length).toBeGreaterThan(0);
  });

  it('renders footer', () => {
    renderWithProviders(<App />);
    
    const footer = screen.getByRole('contentinfo');
    expect(footer).toBeInTheDocument();
  });
});