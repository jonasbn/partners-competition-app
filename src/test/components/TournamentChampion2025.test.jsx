import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '../../utils/ThemeContext';
import '../../utils/i18n';
import TournamentChampion2025 from '../../components/TournamentChampion2025';

vi.mock('../../utils/dataUtils', () => ({
  getLeaderboardData: () => ({
    players: [
      { id: 1, name: 'Jonas', cumulativeScore: 42, wins: 14, winRate: 70.0, gamesPlayed: 20 },
      { id: 2, name: 'Torben', cumulativeScore: 36, wins: 10, winRate: 50.0, gamesPlayed: 20 }
    ]
  }),
  getGames: () => [
    { gameId: 1, gameDate: '2025-04-12', teams: [] },
    { gameId: 2, gameDate: '2025-11-30', teams: [] }
  ],
  getTeamStatistics: () => [
    { players: ['Jonas', 'Gitte'], wins: 8, totalPoints: 52, gamesPlayed: 12, winRate: 66.7 },
    { players: ['Torben', 'Anette'], wins: 5, totalPoints: 38, gamesPlayed: 12, winRate: 41.7 }
  ]
}));

const renderWithProviders = (component) => {
  return render(
    <ThemeProvider>
      {component}
    </ThemeProvider>
  );
};

describe('TournamentChampion2025 Component', () => {
  it('renders without crashing', () => {
    renderWithProviders(<TournamentChampion2025 />);
    const container = document.querySelector('.card');
    expect(container).toBeInTheDocument();
  });

  it('displays the champion player name', () => {
    renderWithProviders(<TournamentChampion2025 />);
    expect(screen.getByText('Jonas')).toBeInTheDocument();
  });

  it('displays the best team player names', () => {
    renderWithProviders(<TournamentChampion2025 />);
    expect(screen.getByText('Jonas & Gitte')).toBeInTheDocument();
  });

  it('displays the total game count', () => {
    renderWithProviders(<TournamentChampion2025 />);
    // The translation for totalGames renders "2 games played"
    expect(screen.getByText(/2/)).toBeInTheDocument();
  });

  it('displays the champion cumulative score', () => {
    renderWithProviders(<TournamentChampion2025 />);
    expect(screen.getByText('42')).toBeInTheDocument();
  });

  it('displays avatar elements for champion and team', () => {
    renderWithProviders(<TournamentChampion2025 />);
    // SimpleAvatarWithHover renders img tags; champion + 2 team members = 3 avatars
    const avatars = document.querySelectorAll('img');
    expect(avatars.length).toBeGreaterThanOrEqual(3);
  });

  it('displays the date range', () => {
    renderWithProviders(<TournamentChampion2025 />);
    expect(screen.getByText(/2025-04-12/)).toBeInTheDocument();
    expect(screen.getByText(/2025-11-30/)).toBeInTheDocument();
  });

  it('has Bootstrap card structure', () => {
    renderWithProviders(<TournamentChampion2025 />);
    const cards = document.querySelectorAll('.card');
    expect(cards.length).toBeGreaterThan(0);
  });
});
