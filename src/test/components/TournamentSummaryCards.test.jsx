import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '../../utils/ThemeContext';
import i18n from '../../utils/i18n';
import TournamentSummaryCards from '../../components/TournamentSummaryCards';

const mockProcessTournamentData = vi.fn();
const mockGetTournamentTeamStatistics = vi.fn();
vi.mock('../../utils/tournamentUtils', () => ({
  processTournamentData: (...args) => mockProcessTournamentData(...args),
  getTournamentTeamStatistics: (...args) => mockGetTournamentTeamStatistics(...args)
}));

const renderWithProviders = (component) =>
  render(<ThemeProvider>{component}</ThemeProvider>);

describe('TournamentSummaryCards', () => {
  beforeEach(() => {
    i18n.changeLanguage('da');
  });

  describe('error state', () => {
    beforeEach(() => {
      mockProcessTournamentData.mockImplementation(() => { throw new Error('load failed'); });
    });

    it('shows the error alert', () => {
      renderWithProviders(<TournamentSummaryCards gameData={[]} />);
      expect(screen.getByText(/load failed/)).toBeInTheDocument();
    });
  });

  describe('no games played yet (real tournamentUtils always returns all 8 players, even at 0 games)', () => {
    beforeEach(() => {
      mockProcessTournamentData.mockReturnValue({
        players: [
          { id: 1, name: 'Jonas', cumulativeScore: 0, gamesPlayed: 0, winRate: 0 },
          { id: 2, name: 'Torben', cumulativeScore: 0, gamesPlayed: 0, winRate: 0 }
        ],
        games: []
      });
      mockGetTournamentTeamStatistics.mockReturnValue([]);
    });

    it('does not show a player name as the leader', () => {
      renderWithProviders(<TournamentSummaryCards gameData={[]} />);
      expect(screen.queryByText('Jonas')).not.toBeInTheDocument();
    });

    it('shows "no leader data" instead', () => {
      renderWithProviders(<TournamentSummaryCards gameData={[]} />);
      expect(screen.getByText('Ingen lederdata tilgængelig')).toBeInTheDocument();
    });
  });

  describe('happy path', () => {
    beforeEach(() => {
      mockProcessTournamentData.mockReturnValue({
        players: [
          { id: 1, name: 'Jonas', cumulativeScore: 4, gamesPlayed: 2, winRate: 100 },
          { id: 7, name: 'Malene', cumulativeScore: 1, gamesPlayed: 1, winRate: 0 }
        ],
        games: [
          { gameId: 1, gameDate: '2026-07-15', teams: [{ players: ['Jonas', 'Torben'], score: 2 }, { players: ['Malene', 'Kurt'], score: 1 }] }
        ]
      });
      mockGetTournamentTeamStatistics.mockReturnValue([
        { players: ['Jonas', 'Torben'], gamesPlayed: 2, wins: 2, losses: 0, winRate: 100, totalPoints: 4 }
      ]);
    });

    it('shows the leading player name', () => {
      renderWithProviders(<TournamentSummaryCards gameData={[]} />);
      expect(screen.getByText('Jonas')).toBeInTheDocument();
    });

    it('shows the best team players', () => {
      renderWithProviders(<TournamentSummaryCards gameData={[]} />);
      expect(screen.getByText('Jonas & Torben')).toBeInTheDocument();
    });

    it('shows the total games played', () => {
      renderWithProviders(<TournamentSummaryCards gameData={[]} />);
      expect(screen.getByText('1')).toBeInTheDocument();
    });
  });
});
