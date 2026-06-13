import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '../../utils/ThemeContext';
import '../../utils/i18n';
import SimpleGamesCalendar from '../../components/SimpleGamesCalendar';

const mockGetGames = vi.fn();
vi.mock('../../utils/dataUtils', () => ({
  getGames: (...args) => mockGetGames(...args)
}));

const renderWithProviders = (component) =>
  render(<ThemeProvider>{component}</ThemeProvider>);

describe('SimpleGamesCalendar – error state', () => {
  beforeEach(() => {
    mockGetGames.mockImplementation(() => { throw new Error('network error'); });
  });

  it('renders the error card without crashing', () => {
    renderWithProviders(<SimpleGamesCalendar />);
    expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
  });
});

describe('SimpleGamesCalendar – empty state', () => {
  beforeEach(() => {
    mockGetGames.mockReturnValue([]);
  });

  it('renders the empty-state card without crashing', () => {
    renderWithProviders(<SimpleGamesCalendar />);
    expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
  });

  it('shows the no-games heading from gamesCalendar namespace', () => {
    renderWithProviders(<SimpleGamesCalendar />);
    // Danish: "Ingen spil fundet" — from gamesCalendar.noGames (added in locale files)
    expect(screen.getByText('Ingen spil fundet')).toBeInTheDocument();
  });

  it('shows the start-playing prompt from gamesCalendar namespace', () => {
    renderWithProviders(<SimpleGamesCalendar />);
    // Danish: "Start med at spille nogle spil for at se kalenderen her!"
    // gamesList.startPlaying ends "…historikken her!" — a different string.
    // This test only passes once gamesCalendar.startPlaying is added to da.js.
    expect(screen.getByText('Start med at spille nogle spil for at se kalenderen her!')).toBeInTheDocument();
  });
});
