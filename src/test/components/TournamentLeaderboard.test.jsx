import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '../../utils/ThemeContext';
import i18n from '../../utils/i18n';
import TournamentLeaderboard from '../../components/TournamentLeaderboard';

const mockGetTournamentLeaderboardData = vi.fn();
vi.mock('../../utils/tournamentUtils', () => ({
  getTournamentLeaderboardData: (...args) => mockGetTournamentLeaderboardData(...args)
}));

const renderWithProviders = (component) =>
  render(<ThemeProvider>{component}</ThemeProvider>);

describe('TournamentLeaderboard', () => {
  beforeEach(() => {
    i18n.changeLanguage('da');
  });

  describe('empty state', () => {
    beforeEach(() => {
      mockGetTournamentLeaderboardData.mockReturnValue({ players: [], games: [] });
    });

    it('shows the no-data message', () => {
      renderWithProviders(<TournamentLeaderboard gameData={[]} />);
      expect(screen.getByText('Ingen spillerdata tilgængelig.')).toBeInTheDocument();
    });
  });

  describe('players exist but no games played yet (real tournamentUtils always returns all 8 players)', () => {
    beforeEach(() => {
      mockGetTournamentLeaderboardData.mockReturnValue({
        players: [
          { id: 1, name: 'Jonas', cumulativeScore: 0, gamesPlayed: 0, winRate: 0 },
          { id: 2, name: 'Torben', cumulativeScore: 0, gamesPlayed: 0, winRate: 0 }
        ],
        games: []
      });
    });

    it('shows "no game data available" instead of the player table', () => {
      renderWithProviders(<TournamentLeaderboard gameData={[]} />);
      expect(screen.getByText('Ingen spildata tilgængelig')).toBeInTheDocument();
      expect(screen.queryByText('Jonas')).not.toBeInTheDocument();
    });
  });

  describe('happy path', () => {
    beforeEach(() => {
      mockGetTournamentLeaderboardData.mockReturnValue({
        players: [
          { id: 1, name: 'Jonas', cumulativeScore: 4, gamesPlayed: 2, winRate: 100 },
          { id: 7, name: 'Malene', cumulativeScore: 1, gamesPlayed: 1, winRate: 0 }
        ],
        games: [{ gameId: 1 }]
      });
    });

    it('renders every player row', () => {
      renderWithProviders(<TournamentLeaderboard gameData={[]} />);
      expect(screen.getByText('Jonas')).toBeInTheDocument();
      expect(screen.getByText('Malene')).toBeInTheDocument();
    });

    it('shows the total games count from leaderboardData.games.length', () => {
      renderWithProviders(<TournamentLeaderboard gameData={[]} />);
      expect(
        screen.getByText((content) => content.includes('Samlede spil registreret') && content.includes('1'))
      ).toBeInTheDocument();
    });
  });
});
