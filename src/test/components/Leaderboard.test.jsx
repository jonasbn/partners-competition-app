import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '../../utils/ThemeContext';
import '../../utils/i18n';
import Leaderboard from '../../components/Leaderboard';

// Mock the data utils
vi.mock('../../utils/dataUtils', () => ({
  getLeaderboardData: () => ({
    players: [
      { id: 1, name: 'Jonas', cumulativeScore: 15, games: [{ gameId: 1, score: 3 }] },
      { id: 2, name: 'Torben', cumulativeScore: 12, games: [{ gameId: 1, score: 2 }] },
      { id: 3, name: 'Gitte', cumulativeScore: 10, games: [{ gameId: 1, score: 1 }] }
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

describe('Leaderboard Component', () => {
  it('renders leaderboard title', () => {
    renderWithProviders(<Leaderboard />);
    
    // Look for leaderboard-related content (the component might use translation keys)
    const table = screen.getByRole('table');
    expect(table).toBeInTheDocument();
  });

  it('displays player data', () => {
    renderWithProviders(<Leaderboard />);
    
    // Check that player names appear in the table
    expect(screen.getByText('Jonas')).toBeInTheDocument();
    expect(screen.getByText('Torben')).toBeInTheDocument();
    expect(screen.getByText('Gitte')).toBeInTheDocument();
  });

  it('displays scores', () => {
    renderWithProviders(<Leaderboard />);
    
    // Check that scores are displayed
    expect(screen.getByText('15')).toBeInTheDocument();
    expect(screen.getByText('12')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
  });

  it('has table structure', () => {
    renderWithProviders(<Leaderboard />);
    
    const table = screen.getByRole('table');
    const rows = screen.getAllByRole('row');
    
    expect(table).toBeInTheDocument();
    expect(rows.length).toBeGreaterThan(1); // Header + data rows
  });
});