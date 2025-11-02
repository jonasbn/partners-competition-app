import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { ThemeProvider } from '../utils/ThemeContext';
import '../utils/i18n'; // Initialize i18n
import App from '../App';

// Mock the Simple* components to avoid complex rendering issues
vi.mock('../components/SimpleLeaderboard', () => ({
  default: () => <div data-testid="simple-leaderboard">Simple Leaderboard</div>
}));

vi.mock('../components/SimpleGamesList', () => ({
  default: () => <div data-testid="simple-games-list">Simple Games List</div>
}));

vi.mock('../components/SimpleTeamStatistics', () => ({
  default: () => <div data-testid="simple-team-statistics">Simple Team Statistics</div>
}));

vi.mock('../components/SimpleSummaryCards', () => ({
  default: () => <div data-testid="simple-summary-cards">Simple Summary Cards</div>
}));

vi.mock('../components/SimplePlayerPerformance', () => ({
  default: () => <div data-testid="simple-player-performance">Simple Player Performance</div>
}));

vi.mock('../components/SimpleGamesCalendar', () => ({
  default: () => <div data-testid="simple-games-calendar">Simple Games Calendar</div>
}));

vi.mock('../components/SimpleThemeToggle', () => ({
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
      expect(screen.getByTestId('simple-summary-cards')).toBeInTheDocument();
      expect(screen.getByTestId('simple-leaderboard')).toBeInTheDocument();
      expect(screen.getByTestId('simple-player-performance')).toBeInTheDocument();
      expect(screen.getByTestId('simple-games-calendar')).toBeInTheDocument();
      expect(screen.getByTestId('simple-team-statistics')).toBeInTheDocument();
      expect(screen.getByTestId('simple-games-list')).toBeInTheDocument();
    });
  });

  it('renders navigation controls', () => {
    renderWithProviders(<App />);
    
    expect(screen.getByTestId('theme-toggle')).toBeInTheDocument();
    expect(screen.getByTestId('language-selector')).toBeInTheDocument();
  });

  it('renders all required components', async () => {
    renderWithProviders(<App />);
    
    await waitFor(() => {
      // Verify all 6 main components are rendered as per GitHub instructions
      expect(screen.getByTestId('simple-summary-cards')).toBeInTheDocument(); // 1st component
      expect(screen.getByTestId('simple-leaderboard')).toBeInTheDocument(); // 2nd component
      expect(screen.getByTestId('simple-player-performance')).toBeInTheDocument(); // 3rd component
      expect(screen.getByTestId('simple-games-calendar')).toBeInTheDocument(); // 4th component
      expect(screen.getByTestId('simple-team-statistics')).toBeInTheDocument(); // 5th component
      expect(screen.getByTestId('simple-games-list')).toBeInTheDocument(); // 6th component
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

  it('renders footer with current year', () => {
    renderWithProviders(<App />);
    
    const currentYear = new Date().getFullYear();
    const footer = screen.getByRole('contentinfo');
    
    // Should contain the current year instead of {{year}}
    expect(footer).toHaveTextContent(currentYear.toString());
    expect(footer).not.toHaveTextContent('{{year}}');
  });
});