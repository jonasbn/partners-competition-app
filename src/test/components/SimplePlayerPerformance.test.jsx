import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '../../utils/ThemeContext';
import '../../utils/i18n';
import SimplePlayerPerformance from '../../components/SimplePlayerPerformance';

vi.mock('../../components/SimpleAvatarWithHover', () => ({
  default: ({ playerName }) => <span data-testid={`avatar-${playerName}`} />
}));

vi.mock('../../utils/simpleAvatarUtils', () => ({
  getRankBasedAvatar: () => null,
  getPlayerAvatarOptions: () => [],
  getPlayerAvatarPath: () => null,
}));

const mockGetLeaderboardData = vi.fn();
vi.mock('../../utils/dataUtils', () => ({
  getLeaderboardData: (...args) => mockGetLeaderboardData(...args)
}));

const renderWithProviders = (component) =>
  render(<ThemeProvider>{component}</ThemeProvider>);

const sixPlayers = [
  { id: 1, name: 'Jonas',  cumulativeScore: 15, gamesPlayed: 5, winRate: 60.0, avgScore: 3.0, games: [] },
  { id: 2, name: 'Torben', cumulativeScore: 12, gamesPlayed: 5, winRate: 40.0, avgScore: 2.4, games: [] },
  { id: 3, name: 'Gitte',  cumulativeScore: 10, gamesPlayed: 5, winRate: 40.0, avgScore: 2.0, games: [] },
  { id: 4, name: 'Anette', cumulativeScore: 9,  gamesPlayed: 5, winRate: 20.0, avgScore: 1.8, games: [] },
  { id: 5, name: 'Lotte',  cumulativeScore: 8,  gamesPlayed: 5, winRate: 20.0, avgScore: 1.6, games: [] },
  { id: 6, name: 'Peter',  cumulativeScore: 7,  gamesPlayed: 5, winRate: 20.0, avgScore: 1.4, games: [] },
];

describe('SimplePlayerPerformance – error state', () => {
  beforeEach(() => {
    mockGetLeaderboardData.mockImplementation(() => { throw new Error('data error'); });
  });

  it('renders the error heading', () => {
    renderWithProviders(<SimplePlayerPerformance />);
    expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
  });
});

describe('SimplePlayerPerformance – empty state', () => {
  beforeEach(() => {
    mockGetLeaderboardData.mockReturnValue({ players: [], games: [] });
  });

  it('shows the no-data heading', () => {
    renderWithProviders(<SimplePlayerPerformance />);
    expect(screen.getByText('Ingen spillerdata tilgængelig')).toBeInTheDocument();
  });

  it('shows the play-games prompt', () => {
    renderWithProviders(<SimplePlayerPerformance />);
    expect(screen.getByText('Spil nogle spil for at se spillerpræstation her!')).toBeInTheDocument();
  });
});

describe('SimplePlayerPerformance – happy path', () => {
  beforeEach(() => {
    mockGetLeaderboardData.mockReturnValue({ players: sixPlayers, games: [] });
  });

  it('shows the section title', () => {
    renderWithProviders(<SimplePlayerPerformance />);
    expect(screen.getAllByText(/Spillerpræstation Analyse/).length).toBeGreaterThan(0);
  });

  it('renders a card for each player', () => {
    renderWithProviders(<SimplePlayerPerformance />);
    sixPlayers.forEach(p => {
      expect(screen.getByText(new RegExp(`#\\d+ ${p.name}`))).toBeInTheDocument();
    });
  });

  it('shows the rank-1 player with the excellent badge', () => {
    renderWithProviders(<SimplePlayerPerformance />);
    expect(screen.getAllByText('Fremragende').length).toBeGreaterThan(0);
  });

  it('shows an avatar placeholder for each player', () => {
    renderWithProviders(<SimplePlayerPerformance />);
    sixPlayers.forEach(p => {
      expect(screen.getByTestId(`avatar-${p.name}`)).toBeInTheDocument();
    });
  });
});
