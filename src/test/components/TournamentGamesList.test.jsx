import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '../../utils/ThemeContext';
import i18n from '../../utils/i18n';
import TournamentGamesList from '../../components/TournamentGamesList';

const mockGetTournamentGames = vi.fn();
vi.mock('../../utils/tournamentUtils', () => ({
  getTournamentGames: (...args) => mockGetTournamentGames(...args)
}));

const renderWithProviders = (component) =>
  render(<ThemeProvider>{component}</ThemeProvider>);

const oneGame = [
  {
    gameId: 1,
    gameDate: '2026-07-15',
    teams: [
      { players: ['Jonas', 'Torben'], score: 2 },
      { players: ['Malene', 'Kurt'], score: 1 }
    ]
  }
];

describe('TournamentGamesList', () => {
  beforeEach(() => {
    i18n.changeLanguage('da');
  });

  describe('empty state', () => {
    beforeEach(() => {
      mockGetTournamentGames.mockReturnValue([]);
    });

    it('shows the no-games heading', () => {
      renderWithProviders(<TournamentGamesList gameData={[]} />);
      expect(screen.getByText('Ingen spil fundet')).toBeInTheDocument();
    });
  });

  describe('happy path', () => {
    beforeEach(() => {
      mockGetTournamentGames.mockReturnValue(oneGame);
    });

    it('displays both teams for the game', () => {
      renderWithProviders(<TournamentGamesList gameData={[]} />);
      expect(screen.getAllByText('Jonas & Torben').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Malene & Kurt').length).toBeGreaterThan(0);
    });

    it('does not show a 3rd-place label', () => {
      renderWithProviders(<TournamentGamesList gameData={[]} />);
      expect(screen.queryByText(/3\./)).not.toBeInTheDocument();
    });

    it('shows the winner label', () => {
      renderWithProviders(<TournamentGamesList gameData={[]} />);
      expect(screen.getAllByText(/Vinder/).length).toBeGreaterThan(0);
    });
  });
});
