import React from 'react';
import { useTranslation } from 'react-i18next';
import { getLeaderboardData } from '../utils/dataUtils';

const SimpleStatsChart = () => {
  const { t } = useTranslation();
  const { players } = getLeaderboardData();

  // Sort players by score for display
  const sortedPlayers = [...players].sort((a, b) => b.cumulativeScore - a.cumulativeScore);

  return (
    <div className="card mb-4">
      <div className="card-header bg-primary text-white">
        <h2>📊 {t('charts.playerStats.title') || 'Player Statistics'}</h2>
      </div>
      <div className="card-body">
        <div className="alert alert-info">
          <h4>📈 Player Performance Overview</h4>
          <p>Interactive charts are temporarily unavailable. Here's a summary of player statistics:</p>
        </div>
        
        <div className="row">
          {sortedPlayers.map((player, index) => (
            <div key={player.name} className="col-md-6 col-lg-4 mb-3">
              <div className="card border-primary">
                <div className="card-body text-center">
                  <h5 className="card-title">
                    {index === 0 && '🥇 '}
                    {index === 1 && '🥈 '}
                    {index === 2 && '🥉 '}
                    {player.name}
                  </h5>
                  <div className="display-6 text-primary">{player.cumulativeScore}</div>
                  <p className="card-text">Total Points</p>
                  <small className="text-muted">
                    {player.gamesPlayed} games played<br/>
                    Avg: {(player.cumulativeScore / Math.max(player.gamesPlayed, 1)).toFixed(1)} points/game
                  </small>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SimpleStatsChart;