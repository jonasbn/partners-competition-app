import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '../../utils/ThemeContext';
import '../../utils/i18n';
import SimpleSummaryCards from '../../components/SimpleSummaryCards';

// Mock the data utils
vi.mock('../../utils/dataUtils', () => ({
  getLeaderboardData: () => ({
    players: [
      { id: 1, name: 'Jonas', cumulativeScore: 15 },
      { id: 2, name: 'Torben', cumulativeScore: 12 },
      { id: 3, name: 'Gitte', cumulativeScore: 10 }
    ]
  }),
  getGames: () => [
    { gameId: 1, gameDate: '2024-01-15', teams: [] },
    { gameId: 2, gameDate: '2024-01-22', teams: [] }
  ],
  getTeamStatistics: () => [
    { players: ['Jonas', 'Torben'], wins: 2, gamesPlayed: 3, winRate: 66.67 },
    { players: ['Gitte', 'Anette'], wins: 1, gamesPlayed: 2, winRate: 50.0 }
  ]
}));

const renderWithProviders = (component) => {
  return render(
    <ThemeProvider>
      {component}
    </ThemeProvider>
  );
};

describe('SimpleSummaryCards Component', () => {
  it('renders summary cards', () => {
    renderWithProviders(<SimpleSummaryCards />);
    
    // Look for card elements using document.querySelector
    const cards = document.querySelectorAll('.card');
    expect(cards.length).toBeGreaterThan(0);
  });

  it('displays statistical information', () => {
    renderWithProviders(<SimpleSummaryCards />);
    
    // The component should display some numbers/statistics
    const container = document.querySelector('.row');
    expect(container).toBeInTheDocument();
  });

  it('has Bootstrap grid structure', () => {
    renderWithProviders(<SimpleSummaryCards />);
    
    // Check for any Bootstrap column classes
    const element = document.querySelector('[class*="col-"]');
    expect(element).toBeInTheDocument();
  });
});