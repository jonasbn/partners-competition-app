import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider } from '../../utils/ThemeContext';
import { ViewProvider } from '../../utils/ViewContext';
import { YearProvider } from '../../utils/YearContext';
import '../../utils/i18n';
import App from '../../App';

vi.mock('../../components/TournamentSummaryCards', () => ({
  default: () => <div data-testid="tournament-summary-cards">Tournament Summary Cards</div>
}));
vi.mock('../../components/TournamentLeaderboard', () => ({
  default: () => <div data-testid="tournament-leaderboard">Tournament Leaderboard</div>
}));
vi.mock('../../components/TournamentPlayerPerformance', () => ({
  default: () => <div data-testid="tournament-player-performance">Tournament Player Performance</div>
}));
vi.mock('../../components/TournamentGamesCalendar', () => ({
  default: () => <div data-testid="tournament-games-calendar">Tournament Games Calendar</div>
}));
vi.mock('../../components/TournamentTeamStatistics', () => ({
  default: () => <div data-testid="tournament-team-statistics">Tournament Team Statistics</div>
}));
vi.mock('../../components/TournamentGamesList', () => ({
  default: () => <div data-testid="tournament-games-list">Tournament Games List</div>
}));

const renderApp = () => render(
  <ThemeProvider>
    <ViewProvider>
      <YearProvider>
        <App />
      </YearProvider>
    </ViewProvider>
  </ThemeProvider>
);

describe('App — Summer Tournament tab', () => {
  it('shows the season content by default and hides tournament content', () => {
    renderApp();
    expect(screen.queryByTestId('tournament-leaderboard')).not.toBeInTheDocument();
  });

  it('shows the 6 tournament components after switching tabs, and hides the Year selector', () => {
    renderApp();
    fireEvent.click(screen.getByText('Sommerturnering'));

    expect(screen.getByTestId('tournament-summary-cards')).toBeInTheDocument();
    expect(screen.getByTestId('tournament-leaderboard')).toBeInTheDocument();
    expect(screen.getByTestId('tournament-player-performance')).toBeInTheDocument();
    expect(screen.getByTestId('tournament-games-calendar')).toBeInTheDocument();
    expect(screen.getByTestId('tournament-team-statistics')).toBeInTheDocument();
    expect(screen.getByTestId('tournament-games-list')).toBeInTheDocument();
    expect(screen.queryByText('2025')).not.toBeInTheDocument();
  });

  it('switching back to Season restores the season components', () => {
    renderApp();
    fireEvent.click(screen.getByText('Sommerturnering'));
    fireEvent.click(screen.getByText('Sæson'));

    expect(screen.queryByTestId('tournament-leaderboard')).not.toBeInTheDocument();
    expect(screen.getByText('2025')).toBeInTheDocument();
  });
});
