import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '../../utils/ThemeContext';
import i18n from '../../utils/i18n';
import TournamentPlayerPerformance from '../../components/TournamentPlayerPerformance';

const mockGetTournamentLeaderboardData = vi.fn();
vi.mock('../../utils/tournamentUtils', () => ({
  getTournamentLeaderboardData: (...args) => mockGetTournamentLeaderboardData(...args)
}));

const renderWithProviders = (component) =>
  render(<ThemeProvider>{component}</ThemeProvider>);

describe('TournamentPlayerPerformance', () => {
  beforeEach(() => {
    i18n.changeLanguage('da');
  });

  describe('empty state', () => {
    beforeEach(() => {
      mockGetTournamentLeaderboardData.mockReturnValue({ players: [] });
    });

    it('shows the no-data message', () => {
      renderWithProviders(<TournamentPlayerPerformance gameData={[]} />);
      expect(screen.getByText('Ingen spillerdata tilgængelig')).toBeInTheDocument();
    });
  });

  describe('no games played yet (all players tied at 0, no real ranking)', () => {
    beforeEach(() => {
      mockGetTournamentLeaderboardData.mockReturnValue({
        players: [
          { id: 1, name: 'Jonas', cumulativeScore: 0, gamesPlayed: 0, winRate: 0, avgScore: 0 },
          { id: 2, name: 'Torben', cumulativeScore: 0, gamesPlayed: 0, winRate: 0, avgScore: 0 }
        ]
      });
    });

    it('shows the crossed-fingers icon instead of a tier icon', () => {
      renderWithProviders(<TournamentPlayerPerformance gameData={[]} />);
      expect(screen.getAllByText('🤞').length).toBe(2);
    });

    it('shows "Afventer" (Awaiting) instead of a performance-level badge', () => {
      renderWithProviders(<TournamentPlayerPerformance gameData={[]} />);
      expect(screen.getAllByText('Afventer').length).toBe(2);
    });

    it('uses the gray (secondary) card styling for every player', () => {
      renderWithProviders(<TournamentPlayerPerformance gameData={[]} />);
      const cards = document.querySelectorAll('.card.border-secondary');
      expect(cards.length).toBe(2);
    });
  });

  describe('happy path', () => {
    beforeEach(() => {
      mockGetTournamentLeaderboardData.mockReturnValue({
        players: [
          { id: 1, name: 'Jonas', cumulativeScore: 4, gamesPlayed: 2, winRate: 100, avgScore: 2 },
          { id: 7, name: 'Malene', cumulativeScore: 1, gamesPlayed: 1, winRate: 0, avgScore: 1 }
        ]
      });
    });

    it('renders a card for each player', () => {
      renderWithProviders(<TournamentPlayerPerformance gameData={[]} />);
      expect(screen.getByText(/Jonas/)).toBeInTheDocument();
      expect(screen.getByText(/Malene/)).toBeInTheDocument();
    });
  });
});
