import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '../../utils/ThemeContext';
import i18n from '../../utils/i18n';
import SimpleGamesList from '../../components/SimpleGamesList';

const mockGetGames = vi.fn();
vi.mock('../../utils/dataUtils', () => ({
  getGames: (...args) => mockGetGames(...args)
}));

const renderWithProviders = (component) =>
  render(<ThemeProvider>{component}</ThemeProvider>);

const twoGames = [
  {
    gameId: 1,
    gameDate: '2026-01-01',
    teams: [
      { players: ['Jonas', 'Torben'], score: 3 },
      { players: ['Gitte', 'Anette'], score: 2 },
      { players: ['Lotte', 'Peter'], score: 1 }
    ]
  },
  {
    gameId: 2,
    gameDate: '2026-01-08',
    teams: [
      { players: ['Gitte', 'Lotte'], score: 3 },
      { players: ['Jonas', 'Peter'], score: 2 },
      { players: ['Torben', 'Anette'], score: 1 }
    ]
  }
];

describe('SimpleGamesList – error state', () => {
  beforeEach(() => {
    i18n.changeLanguage('da');
  });

  beforeEach(() => {
    mockGetGames.mockImplementation(() => { throw new Error('load failed'); });
  });

  it('renders the error heading', () => {
    renderWithProviders(<SimpleGamesList />);
    expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
  });

  it('shows the error message text', () => {
    renderWithProviders(<SimpleGamesList />);
    expect(screen.getAllByText(/Fejl ved indlæsning/).length).toBeGreaterThan(0);
  });
});

describe('SimpleGamesList – empty state', () => {
  beforeEach(() => {
    mockGetGames.mockReturnValue([]);
  });

  it('shows the no-games heading', () => {
    renderWithProviders(<SimpleGamesList />);
    expect(screen.getByText('Ingen spil fundet')).toBeInTheDocument();
  });

  it('shows the start-playing prompt', () => {
    renderWithProviders(<SimpleGamesList />);
    expect(screen.getByText('Start med at spille nogle spil for at se historikken her!')).toBeInTheDocument();
  });
});

describe('SimpleGamesList – happy path', () => {
  beforeEach(() => {
    mockGetGames.mockReturnValue(twoGames);
  });

  it('renders the games list title', () => {
    renderWithProviders(<SimpleGamesList />);
    expect(screen.getByText(/Spil Historie/)).toBeInTheDocument();
  });

  it('shows the total games count', () => {
    renderWithProviders(<SimpleGamesList />);
    expect(
      screen.getByText((content) => content.includes('Samlede Spil') && content.includes('2'))
    ).toBeInTheDocument();
  });

  it('renders a card for each game', () => {
    renderWithProviders(<SimpleGamesList />);
    expect(screen.getAllByText(/Spil 1/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Spil 2/).length).toBeGreaterThan(0);
  });

  it('displays player names inside game cards', () => {
    renderWithProviders(<SimpleGamesList />);
    expect(screen.getAllByText('Jonas & Torben').length).toBeGreaterThan(0);
  });

  it('shows the winner label for each game', () => {
    renderWithProviders(<SimpleGamesList />);
    expect(screen.getAllByText(/Vinder/).length).toBeGreaterThan(0);
  });
});
