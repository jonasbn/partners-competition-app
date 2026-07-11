import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '../../utils/ThemeContext';
import i18n from '../../utils/i18n';
import TournamentTeamStatistics from '../../components/TournamentTeamStatistics';

const mockGetTournamentTeamStatistics = vi.fn();
vi.mock('../../utils/tournamentUtils', () => ({
  getTournamentTeamStatistics: (...args) => mockGetTournamentTeamStatistics(...args)
}));

const renderWithProviders = (component) =>
  render(<ThemeProvider>{component}</ThemeProvider>);

describe('TournamentTeamStatistics', () => {
  beforeEach(() => {
    i18n.changeLanguage('da');
  });

  describe('empty state', () => {
    beforeEach(() => {
      mockGetTournamentTeamStatistics.mockReturnValue([]);
    });

    it('shows the no-data message', () => {
      renderWithProviders(<TournamentTeamStatistics gameData={[]} />);
      expect(screen.getByText('Ingen hold data tilgængelig')).toBeInTheDocument();
    });
  });

  describe('happy path', () => {
    beforeEach(() => {
      mockGetTournamentTeamStatistics.mockReturnValue([
        { players: ['Jonas', 'Torben'], gamesPlayed: 2, wins: 2, losses: 0, winRate: 100, totalPoints: 4 },
        { players: ['Malene', 'Kurt'], gamesPlayed: 2, wins: 0, losses: 2, winRate: 0, totalPoints: 2 }
      ]);
    });

    it('renders a row per team', () => {
      renderWithProviders(<TournamentTeamStatistics gameData={[]} />);
      expect(screen.getByText('Jonas')).toBeInTheDocument();
      expect(screen.getByText('Malene')).toBeInTheDocument();
    });

    it('does not render a 3rd-place column', () => {
      renderWithProviders(<TournamentTeamStatistics gameData={[]} />);
      expect(screen.queryByText('3. Pladser')).not.toBeInTheDocument();
    });
  });
});
