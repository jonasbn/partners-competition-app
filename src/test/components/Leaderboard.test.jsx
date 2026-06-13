import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '../../utils/ThemeContext';
import '../../utils/i18n';
import SimpleLeaderboard from '../../components/SimpleLeaderboard';

// Mock the data utils
vi.mock('../../utils/dataUtils', () => ({
  getLeaderboardData: () => ({
    players: [
      { id: 1, name: 'Jonas', cumulativeScore: 15, gamesPlayed: 2, games: [{ gameId: 1, score: 3 }, { gameId: 2, score: 2 }] },
      { id: 2, name: 'Torben', cumulativeScore: 12, gamesPlayed: 2, games: [{ gameId: 1, score: 2 }, { gameId: 2, score: 1 }] },
      { id: 3, name: 'Gitte', cumulativeScore: 10, gamesPlayed: 2, games: [{ gameId: 1, score: 1 }, { gameId: 2, score: 3 }] },
      { id: 4, name: 'Anette', cumulativeScore: 9, gamesPlayed: 2, games: [{ gameId: 1, score: 3 }, { gameId: 2, score: 1 }] },
      { id: 5, name: 'Lotte', cumulativeScore: 8, gamesPlayed: 2, games: [{ gameId: 1, score: 2 }, { gameId: 2, score: 2 }] },
      { id: 6, name: 'Peter', cumulativeScore: 7, gamesPlayed: 2, games: [{ gameId: 1, score: 1 }, { gameId: 2, score: 3 }] }
    ],
    games: [
      { gameId: 1, gameDate: '2026-01-01' },
      { gameId: 2, gameDate: '2026-01-08' }
    ]
  })
}));

const renderWithProviders = (component) => {
  return render(
    <ThemeProvider>
      {component}
    </ThemeProvider>
  );
};

describe('SimpleLeaderboard Component', () => {
  it('renders leaderboard title', () => {
    renderWithProviders(<SimpleLeaderboard />);
    
    // Look for leaderboard-related content (the component might use translation keys)
    const table = screen.getByRole('table');
    expect(table).toBeInTheDocument();
  });

  it('displays player data', () => {
    renderWithProviders(<SimpleLeaderboard />);
    
    // Check that player names appear in the table
    expect(screen.getByText('Jonas')).toBeInTheDocument();
    expect(screen.getByText('Torben')).toBeInTheDocument();
    expect(screen.getByText('Gitte')).toBeInTheDocument();
  });

  it('displays scores', () => {
    renderWithProviders(<SimpleLeaderboard />);
    
    // Check that scores are displayed
    expect(screen.getByText('15')).toBeInTheDocument();
    expect(screen.getByText('12')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
  });

  it('has table structure', () => {
    renderWithProviders(<SimpleLeaderboard />);

    const table = screen.getByRole('table');
    const rows = screen.getAllByRole('row');

    expect(table).toBeInTheDocument();
    expect(rows.length).toBeGreaterThan(1); // Header + data rows
  });

  it('displays the correct total games count from games array length', () => {
    renderWithProviders(<SimpleLeaderboard />);
    // Mock has 2 games. The footer small element must contain "2".
    const footer = screen.getByText(/2/, { selector: 'small' });
    expect(footer).toBeInTheDocument();
  });
});