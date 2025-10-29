import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '../../utils/ThemeContext';
import '../../utils/i18n';
import SummaryCards from '../../components/SummaryCards';

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

describe('SummaryCards Component', () => {
  it('renders summary cards', () => {
    renderWithProviders(<SummaryCards />);
    
    // Look for card elements using document.querySelector
    const cards = document.querySelectorAll('.card');
    expect(cards.length).toBeGreaterThan(0);
  });

  it('displays statistical information', () => {
    renderWithProviders(<SummaryCards />);
    
    // The component should display some numbers/statistics
    const container = document.querySelector('.row');
    expect(container).toBeInTheDocument();
  });

  it('has Bootstrap grid structure', () => {
    renderWithProviders(<SummaryCards />);
    
    // Check for Bootstrap column classes
    const element = document.querySelector('.col-md-4, .col-lg-4, .col-sm-6');
    expect(element).toBeInTheDocument();
  });
});