import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '../../utils/ThemeContext';
import '../../utils/i18n';
import TournamentGamesCalendar from '../../components/TournamentGamesCalendar';

const mockGetTournamentGames = vi.fn();
vi.mock('../../utils/tournamentUtils', () => ({
  getTournamentGames: (...args) => mockGetTournamentGames(...args)
}));

const renderWithProviders = (component) =>
  render(<ThemeProvider>{component}</ThemeProvider>);

describe('TournamentGamesCalendar – error state', () => {
  beforeEach(() => {
    mockGetTournamentGames.mockImplementation(() => { throw new Error('network error'); });
  });

  it('renders the error card without crashing', () => {
    renderWithProviders(<TournamentGamesCalendar gameData={[]} />);
    expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
  });
});

describe('TournamentGamesCalendar – empty state', () => {
  beforeEach(() => {
    mockGetTournamentGames.mockReturnValue([]);
  });

  it('shows the no-games heading', () => {
    renderWithProviders(<TournamentGamesCalendar gameData={[]} />);
    expect(screen.getByText('Ingen spil fundet')).toBeInTheDocument();
  });
});

describe('TournamentGamesCalendar – happy path', () => {
  beforeEach(() => {
    mockGetTournamentGames.mockReturnValue([
      { gameId: 1, gameDate: '2026-07-15', teams: [{ players: ['Jonas', 'Torben'], score: 2 }, { players: ['Malene', 'Kurt'], score: 1 }] }
    ]);
  });

  it('shows the total games stat', () => {
    renderWithProviders(<TournamentGamesCalendar gameData={[]} />);
    expect(screen.getAllByText('1').length).toBeGreaterThan(0);
  });
});
