import React from 'react';
import { useTranslation } from 'react-i18next';
import { getGames } from '../utils/dataUtils';

const SimplePerformanceChart = () => {
  const { t } = useTranslation();
  const games = getGames();

  // Get all players and their performance over time
  const allPlayers = [...new Set(games.flatMap(game => 
    game.teams.flatMap(team => team.players)
  ))];

  const playerPerformance = allPlayers.map(player => {
    const playerGames = games.filter(game => 
      game.teams.some(team => team.players.includes(player))
    );
    
    const scores = playerGames.map(game => {
      const team = game.teams.find(team => team.players.includes(player));
      return team ? team.score : 0;
    });

    const totalScore = scores.reduce((sum, score) => sum + score, 0);
    const avgScore = totalScore / Math.max(scores.length, 1);
    const maxScore = Math.max(...scores);
    const minScore = Math.min(...scores);

    return {
      player,
      gamesPlayed: scores.length,
      totalScore,
      avgScore: avgScore.toFixed(1),
      maxScore,
      minScore,
      trend: scores.length >= 2 ? (scores[scores.length - 1] > scores[0] ? '📈' : '📉') : '➡️'
    };
  });

  // Sort by average score
  playerPerformance.sort((a, b) => b.avgScore - a.avgScore);

  return (
    <div className="card mb-4">
      <div className="card-header bg-success text-white">
        <h2>📈 {t('charts.playerPerformance.title') || 'Player Performance'}</h2>
      </div>
      <div className="card-body">
        <div className="alert alert-info">
          <h4>🏃‍♂️ Performance Trends</h4>
          <p>Interactive charts are temporarily unavailable. Here's player performance data:</p>
        </div>

        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Player</th>
                <th>Games</th>
                <th>Total Score</th>
                <th>Avg Score</th>
                <th>Best Game</th>
                <th>Trend</th>
              </tr>
            </thead>
            <tbody>
              {playerPerformance.map((perf, index) => (
                <tr key={perf.player}>
                  <td>
                    <strong>{perf.player}</strong>
                    {index < 3 && <span className="ms-2">🏆</span>}
                  </td>
                  <td>{perf.gamesPlayed}</td>
                  <td><span className="badge bg-primary">{perf.totalScore}</span></td>
                  <td><span className="badge bg-success">{perf.avgScore}</span></td>
                  <td><span className="badge bg-warning text-dark">{perf.maxScore}</span></td>
                  <td>
                    <span title="Performance trend">{perf.trend}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SimplePerformanceChart;