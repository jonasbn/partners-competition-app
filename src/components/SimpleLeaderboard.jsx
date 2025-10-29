import React from 'react';
import { getLeaderboardData } from '../utils/dataUtils';

// Simple Leaderboard without i18n or external dependencies
const SimpleLeaderboard = () => {
  const { players } = getLeaderboardData();

  // Simple avatar fallback without complex dependencies
  const getPlayerInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getRankEmoji = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈'; 
    if (rank === 3) return '🥉';
    return `${rank}.`;
  };

  return (
    <div className="card">
      <div className="card-header bg-primary text-white">
        <h2>🏆 Leaderboard</h2>
      </div>
      <div className="card-body">
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead className="table-dark">
              <tr>
                <th>Rank</th>
                <th>Player</th>
                <th>Score</th>
                <th>Games</th>
                <th>Avg</th>
                <th>Win Rate</th>
              </tr>
            </thead>
            <tbody>
              {players.map((player, index) => (
                <tr key={player.name}>
                  <td>
                    <strong>{getRankEmoji(index + 1)}</strong>
                  </td>
                  <td>
                    <div className="d-flex align-items-center">
                      <div 
                        className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-2"
                        style={{ width: '32px', height: '32px', fontSize: '12px' }}
                      >
                        {getPlayerInitials(player.name)}
                      </div>
                      <strong>{player.name}</strong>
                    </div>
                  </td>
                  <td>
                    <span className="badge bg-success fs-6">
                      {player.cumulativeScore}
                    </span>
                  </td>
                  <td>{player.gamesPlayed}</td>
                  <td>
                    {(player.cumulativeScore / Math.max(player.gamesPlayed, 1)).toFixed(1)}
                  </td>
                  <td>
                    <span className={`badge ${player.winRate >= 50 ? 'bg-success' : 'bg-warning'}`}>
                      {player.winRate.toFixed(1)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="mt-3">
          <small className="text-muted">
            Total players: {players.length} | 
            Total games tracked: {players.reduce((sum, p) => sum + p.gamesPlayed, 0) / 2}
          </small>
        </div>
      </div>
    </div>
  );
};

export default SimpleLeaderboard;