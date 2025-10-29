import React from 'react';
import { useTranslation } from 'react-i18next';
import { getLeaderboardData } from '../utils/dataUtils';

const SimpleDistributionChart = () => {
  const { t } = useTranslation();
  const { players } = getLeaderboardData();

  // Calculate distribution data
  const totalPoints = players.reduce((sum, player) => sum + player.cumulativeScore, 0);
  const playerDistribution = players.map(player => ({
    ...player,
    percentage: ((player.cumulativeScore / totalPoints) * 100).toFixed(1)
  })).sort((a, b) => b.cumulativeScore - a.cumulativeScore);

  // Generate colors for each player
  const colors = ['#e8c1a0', '#f47560', '#f1e15b', '#e8a838', '#61cdbb', '#97e3d5'];

  return (
    <div className="card mb-4">
      <div className="card-header bg-secondary text-white">
        <h2>🍩 {t('charts.pointsDistribution.title') || 'Points Distribution'}</h2>
      </div>
      <div className="card-body">
        <div className="alert alert-info">
          <h4>📊 Score Distribution</h4>
          <p>Interactive charts are temporarily unavailable. Here's the points distribution:</p>
        </div>

        <div className="row">
          <div className="col-md-6">
            <h5>Distribution Overview</h5>
            <div className="mb-3">
              <strong>Total Points: {totalPoints}</strong>
            </div>
            
            {playerDistribution.map((player, index) => (
              <div key={player.name} className="mb-2">
                <div className="d-flex justify-content-between align-items-center">
                  <span>{player.name}</span>
                  <span className="badge bg-primary">{player.percentage}%</span>
                </div>
                <div className="progress" style={{ height: '20px' }}>
                  <div 
                    className="progress-bar" 
                    role="progressbar" 
                    style={{ 
                      width: `${player.percentage}%`,
                      backgroundColor: colors[index % colors.length]
                    }}
                    aria-valuenow={player.percentage} 
                    aria-valuemin="0" 
                    aria-valuemax="100"
                  >
                    {player.cumulativeScore}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="col-md-6">
            <h5>Statistics</h5>
            <div className="table-responsive">
              <table className="table table-sm">
                <thead>
                  <tr>
                    <th>Player</th>
                    <th>Points</th>
                    <th>Share</th>
                    <th>Games</th>
                  </tr>
                </thead>
                <tbody>
                  {playerDistribution.map((player, index) => (
                    <tr key={player.name}>
                      <td>
                        <span 
                          className="badge me-2" 
                          style={{ backgroundColor: colors[index % colors.length] }}
                        >
                          ●
                        </span>
                        {player.name}
                      </td>
                      <td><strong>{player.cumulativeScore}</strong></td>
                      <td>{player.percentage}%</td>
                      <td>{player.gamesPlayed}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleDistributionChart;