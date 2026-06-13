import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import { ThemeProvider } from '../../utils/ThemeContext';
import '../../utils/i18n';
import SimpleTeamStatistics from '../../components/SimpleTeamStatistics';

const getRankBasedAvatarMock = vi.fn((playerName) => `/assets/${playerName.toLowerCase()}/ok.png`);

vi.mock('../../utils/simpleAvatarUtils', () => ({
  getRankBasedAvatar: (playerName, rank) => getRankBasedAvatarMock(playerName, rank),
  getPlayerAvatarOptions: () => [],
  getPlayerAvatarPath: () => null,
}));

vi.mock('../../components/SimpleAvatarWithHover', () => ({
  default: ({ playerName }) => <span data-testid={`avatar-${playerName}`} />,
}));

vi.mock('../../utils/dataUtils', () => ({
  getTeamStatistics: () => [
    { players: ['Jonas', 'Torben'], rank: 1, gamesPlayed: 5, wins: 3, totalPoints: 12, winRate: 60 },
    { players: ['Gitte', 'Anette'], rank: 5, gamesPlayed: 5, wins: 2, totalPoints: 9, winRate: 40 },
    { players: ['Lotte', 'Peter'], rank: 10, gamesPlayed: 5, wins: 0, totalPoints: 5, winRate: 0 },
  ]
}));

const renderWithProviders = (component) =>
  render(<ThemeProvider>{component}</ThemeProvider>);

describe('SimpleTeamStatistics – avatar rank selection', () => {
  beforeEach(() => {
    getRankBasedAvatarMock.mockClear();
  });

  it('passes avatarRank=1 (happy) for a team ranked 1st–3rd', () => {
    renderWithProviders(<SimpleTeamStatistics />);
    const callsForJonas = getRankBasedAvatarMock.mock.calls.filter(([name]) => name === 'Jonas');
    expect(callsForJonas.length).toBeGreaterThan(0);
    expect(callsForJonas[0][1]).toBe(1);
  });

  it('passes avatarRank=2 (ok/neutral) for a team ranked 4th–9th', () => {
    renderWithProviders(<SimpleTeamStatistics />);
    const callsForGitte = getRankBasedAvatarMock.mock.calls.filter(([name]) => name === 'Gitte');
    expect(callsForGitte.length).toBeGreaterThan(0);
    // Before the fix this will be 4 (sad). After the fix it must be 2 (ok).
    expect(callsForGitte[0][1]).toBe(2);
  });

  it('passes avatarRank=4 (sad) for a team ranked 10th+', () => {
    renderWithProviders(<SimpleTeamStatistics />);
    const callsForLotte = getRankBasedAvatarMock.mock.calls.filter(([name]) => name === 'Lotte');
    expect(callsForLotte.length).toBeGreaterThan(0);
    expect(callsForLotte[0][1]).toBe(4);
  });
});
