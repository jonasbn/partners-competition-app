import React from 'react';
import { useTranslation } from 'react-i18next';
import { getLeaderboardData, getGames, getTeamStatistics } from '../utils/dataUtils';
import SimpleAvatarWithHover from './SimpleAvatarWithHover';
import { getRankBasedAvatar } from '../utils/simpleAvatarUtils';

const TournamentChampion2025 = () => {
  const { t } = useTranslation();

  const { champion, bestTeam, totalGames, dateRange, dataError } = React.useMemo(() => {
    try {
      const leaderboardData = getLeaderboardData();
      const players = leaderboardData.players || [];
      const games = leaderboardData.games || getGames();
      const teamStats = getTeamStatistics();

      let computedDateRange = null;

      if (games.length > 0) {
        const dates = games.map(g => g.gameDate).sort();
        computedDateRange = { start: dates[0], end: dates[dates.length - 1] };
      }

      return {
        champion: players.length > 0 ? players[0] : null,
        bestTeam: teamStats.length > 0 ? teamStats[0] : null,
        totalGames: games.length,
        dateRange: computedDateRange,
        dataError: null
      };
    } catch (error) {
      console.error('Error loading tournament data:', error);

      return {
        champion: null,
        bestTeam: null,
        totalGames: 0,
        dateRange: null,
        dataError: error.message
      };
    }
  }, []);

  if (dataError) {
    return (
      <div className="alert alert-danger mb-4">
        <strong>{t('tournament2025.noData')}:</strong> {dataError}
      </div>
    );
  }

  if (!champion || !bestTeam) {
    return null;
  }

  return (
    <div className="card border-warning mb-4" style={{ background: 'var(--bs-warning-bg-subtle, #fff9e6)' }}>
      <div className="card-header bg-warning text-dark text-center py-3">
        <h2 className="mb-1 fw-bold">{t('tournament2025.title')}</h2>
        <div className="d-flex justify-content-center align-items-center gap-3 flex-wrap">
          <span className="badge bg-dark fs-6">{t('tournament2025.concluded')}</span>
          {dateRange && (
            <span className="text-dark">
              {t('tournament2025.dateRange', { start: dateRange.start, end: dateRange.end })}
            </span>
          )}
          <span className="text-dark fw-semibold">
            {t('tournament2025.totalGames', { count: totalGames })}
          </span>
        </div>
      </div>

      <div className="card-body">
        <div className="row g-4 justify-content-center">

          {/* Champion */}
          <div className="col-md-5">
            <div className="card h-100 border-success text-center shadow-sm">
              <div className="card-header bg-success text-white">
                <h4 className="mb-0">🏆 {t('tournament2025.champion')}</h4>
              </div>
              <div className="card-body d-flex flex-column align-items-center justify-content-center py-4">
                <div className="mb-3">
                  <SimpleAvatarWithHover
                    playerName={champion.name}
                    avatarSrc={getRankBasedAvatar(champion.name, 1)}
                    size={90}
                  />
                </div>
                <h3 className="text-success fw-bold mb-2">{champion.name}</h3>
                <div className="display-5 text-success fw-bold mb-1">
                  {champion.cumulativeScore}
                </div>
                <div className="text-muted mb-3">{t('tournament2025.points')}</div>
                <div className="d-flex gap-4 text-center">
                  <div>
                    <div className="h5 text-success mb-0">{champion.wins}</div>
                    <small className="text-muted">{t('tournament2025.wins')}</small>
                  </div>
                  <div>
                    <div className="h5 text-success mb-0">{(champion.winRate || 0).toFixed(1)}%</div>
                    <small className="text-muted">{t('tournament2025.winRate')}</small>
                  </div>
                  <div>
                    <div className="h5 text-success mb-0">{champion.gamesPlayed}</div>
                    <small className="text-muted">{t('tournament2025.gamesPlayed')}</small>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Best Team */}
          <div className="col-md-5">
            <div className="card h-100 border-warning text-center shadow-sm">
              <div className="card-header bg-warning text-dark">
                <h4 className="mb-0">🥇 {t('tournament2025.bestTeam')}</h4>
              </div>
              <div className="card-body d-flex flex-column align-items-center justify-content-center py-4">
                <div className="mb-3 d-flex gap-3 justify-content-center">
                  {bestTeam.players.map((player) => (
                    <SimpleAvatarWithHover
                      key={player}
                      playerName={player}
                      avatarSrc={getRankBasedAvatar(player, 1)}
                      size={90}
                    />
                  ))}
                </div>
                <h3 className="text-warning fw-bold mb-2">{bestTeam.players.join(' & ')}</h3>
                <div className="display-5 text-warning fw-bold mb-1">
                  {bestTeam.wins}
                </div>
                <div className="text-muted mb-3">{t('tournament2025.wins')}</div>
                <div className="d-flex gap-4 text-center">
                  <div>
                    <div className="h5 text-warning mb-0">{bestTeam.totalPoints}</div>
                    <small className="text-muted">{t('tournament2025.points')}</small>
                  </div>
                  <div>
                    <div className="h5 text-warning mb-0">{(bestTeam.winRate || 0).toFixed(1)}%</div>
                    <small className="text-muted">{t('tournament2025.winRate')}</small>
                  </div>
                  <div>
                    <div className="h5 text-warning mb-0">{bestTeam.gamesPlayed}</div>
                    <small className="text-muted">{t('tournament2025.gamesPlayed')}</small>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default TournamentChampion2025;
