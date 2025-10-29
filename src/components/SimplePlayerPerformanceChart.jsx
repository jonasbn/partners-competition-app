import React from 'react';
import { getLeaderboardData, getGames } from '../utils/dataUtils';
import SimpleAvatarWithHover from './AvatarWithHover';

const SimplePlayerPerformanceChart = () => {
  try {
    const leaderboardData = getLeaderboardData();
    const games = getGames();

    if (!leaderboardData?.length || !games?.length) {
      return (
        <div className="card">
          <div className="card-header">
            <h3 className="card-title mb-0">Player Performance Trends</h3>
          </div>
          <div className="card-body text-center text-muted">
            <p>No performance data available</p>
          </div>
        </div>
      );
    }

    // Calculate performance metrics for each player
    const playerMetrics = leaderboardData.map(player => {
      // Get player's games
      const playerGames = games.filter(game => 
        game.player1?.toLowerCase() === player.name?.toLowerCase() || 
        game.player2?.toLowerCase() === player.name?.toLowerCase()
      );

      // Calculate recent form (last 5 games)
      const recentGames = playerGames.slice(-5);
      const recentWins = recentGames.filter(game => {
        const isPlayer1 = game.player1?.toLowerCase() === player.name?.toLowerCase();
        return isPlayer1 ? game.score1 > game.score2 : game.score2 > game.score1;
      }).length;

      // Calculate streaks
      let currentStreak = 0;
      let streakType = 'none';
      
      for (let i = playerGames.length - 1; i >= 0; i--) {
        const game = playerGames[i];
        const isPlayer1 = game.player1?.toLowerCase() === player.name?.toLowerCase();
        const won = isPlayer1 ? game.score1 > game.score2 : game.score2 > game.score1;
        
        if (i === playerGames.length - 1) {
          streakType = won ? 'win' : 'loss';
          currentStreak = 1;
        } else if ((streakType === 'win' && won) || (streakType === 'loss' && !won)) {
          currentStreak++;
        } else {
          break;
        }
      }

      // Calculate average margin (how decisively they win/lose)
      const margins = playerGames.map(game => {
        const isPlayer1 = game.player1?.toLowerCase() === player.name?.toLowerCase();
        if (isPlayer1) {
          return game.score1 - game.score2;
        } else {
          return game.score2 - game.score1;
        }
      });
      
      const avgMargin = margins.length > 0 ? 
        margins.reduce((sum, margin) => sum + margin, 0) / margins.length : 0;

      // Performance consistency (standard deviation of margins)
      const consistency = margins.length > 1 ? 
        Math.sqrt(margins.reduce((sum, margin) => sum + Math.pow(margin - avgMargin, 2), 0) / margins.length) : 0;

      // Opponent strength faced
      const opponentRanks = playerGames.map(game => {
        const isPlayer1 = game.player1?.toLowerCase() === player.name?.toLowerCase();
        const opponentName = isPlayer1 ? game.player2 : game.player1;
        const opponent = leaderboardData.find(p => p.name?.toLowerCase() === opponentName?.toLowerCase());
        return opponent ? leaderboardData.indexOf(opponent) + 1 : leaderboardData.length;
      });
      
      const avgOpponentRank = opponentRanks.length > 0 ? 
        opponentRanks.reduce((sum, rank) => sum + rank, 0) / opponentRanks.length : 0;

      return {
        ...player,
        gamesPlayed: playerGames.length,
        recentForm: recentGames.length > 0 ? (recentWins / recentGames.length) * 100 : 0,
        recentGamesCount: recentGames.length,
        currentStreak,
        streakType,
        avgMargin: Math.round(avgMargin * 10) / 10,
        consistency: Math.round(consistency * 10) / 10,
        avgOpponentRank: Math.round(avgOpponentRank * 10) / 10
      };
    });

    // Sort by overall points for display
    const sortedPlayers = [...playerMetrics].sort((a, b) => (b.points || 0) - (a.points || 0));

    // Helper functions
    const getFormColor = (form) => {
      if (form >= 80) return 'text-success';
      if (form >= 60) return 'text-warning';
      return 'text-danger';
    };

    const getFormBadge = (form) => {
      if (form >= 80) return 'badge bg-success';
      if (form >= 60) return 'badge bg-warning';
      return 'badge bg-danger';
    };

    const getStreakBadge = (streak, type) => {
      if (streak <= 1) return '';
      const color = type === 'win' ? 'success' : 'danger';
      const icon = type === 'win' ? '🔥' : '❄️';
      return `badge bg-${color}`;
    };

    const getConsistencyLevel = (consistency) => {
      if (consistency <= 2) return { level: 'Very Consistent', color: 'success' };
      if (consistency <= 4) return { level: 'Consistent', color: 'primary' };
      if (consistency <= 6) return { level: 'Variable', color: 'warning' };
      return { level: 'Inconsistent', color: 'danger' };
    };

    const getOpponentStrengthLevel = (avgRank, totalPlayers) => {
      const percentile = (avgRank / totalPlayers) * 100;
      if (percentile <= 33) return { level: 'Elite Competition', color: 'danger' };
      if (percentile <= 66) return { level: 'Strong Competition', color: 'warning' };
      return { level: 'Mixed Competition', color: 'primary' };
    };

    return (
      <div className="card">
        <div className="card-header">
          <h3 className="card-title mb-0">Player Performance Analysis</h3>
          <small className="text-muted">Detailed performance metrics and trends</small>
        </div>
        <div className="card-body">
          <div className="row">
            {sortedPlayers.map((player, index) => {
              const consistencyInfo = getConsistencyLevel(player.consistency);
              const opponentStrengthInfo = getOpponentStrengthLevel(player.avgOpponentRank, sortedPlayers.length);
              
              return (
                <div key={player.name || index} className="col-md-6 col-lg-4 mb-4">
                  <div className="card h-100">
                    <div className="card-body">
                      {/* Player Header */}
                      <div className="d-flex align-items-center mb-3">
                        <SimpleAvatarWithHover 
                          playerName={player.name} 
                          rank={index + 1}
                          size="sm"
                        />
                        <div className="ms-2">
                          <h6 className="mb-0">{player.name || 'Unknown'}</h6>
                          <small className="text-muted">#{index + 1} • {player.points || 0} pts</small>
                        </div>
                      </div>

                      {/* Recent Form */}
                      <div className="mb-3">
                        <div className="d-flex justify-content-between align-items-center mb-1">
                          <small className="text-muted">Recent Form</small>
                          <span className={getFormBadge(player.recentForm)}>
                            {Math.round(player.recentForm)}%
                          </span>
                        </div>
                        <div className="progress" style={{ height: '6px' }}>
                          <div 
                            className={`progress-bar ${player.recentForm >= 80 ? 'bg-success' : player.recentForm >= 60 ? 'bg-warning' : 'bg-danger'}`}
                            style={{ width: `${player.recentForm}%` }}
                          ></div>
                        </div>
                        <small className="text-muted">
                          Based on last {player.recentGamesCount} games
                        </small>
                      </div>

                      {/* Current Streak */}
                      {player.currentStreak > 1 && (
                        <div className="mb-3">
                          <span className={getStreakBadge(player.currentStreak, player.streakType)}>
                            {player.streakType === 'win' ? '🔥' : '❄️'} 
                            {player.currentStreak} {player.streakType} streak
                          </span>
                        </div>
                      )}

                      {/* Performance Metrics */}
                      <div className="row g-2 mb-3">
                        <div className="col-6">
                          <div className="text-center p-2 bg-light rounded">
                            <div className="fw-bold text-primary">{player.avgMargin > 0 ? '+' : ''}{player.avgMargin}</div>
                            <small className="text-muted">Avg Margin</small>
                          </div>
                        </div>
                        <div className="col-6">
                          <div className="text-center p-2 bg-light rounded">
                            <div className="fw-bold text-info">{player.gamesPlayed}</div>
                            <small className="text-muted">Games</small>
                          </div>
                        </div>
                      </div>

                      {/* Consistency & Competition Level */}
                      <div className="mb-2">
                        <div className="d-flex justify-content-between align-items-center">
                          <small className="text-muted">Consistency</small>
                          <span className={`badge bg-${consistencyInfo.color}`}>
                            {consistencyInfo.level}
                          </span>
                        </div>
                      </div>

                      <div className="mb-0">
                        <div className="d-flex justify-content-between align-items-center">
                          <small className="text-muted">Competition</small>
                          <span className={`badge bg-${opponentStrengthInfo.color}`}>
                            {opponentStrengthInfo.level}
                          </span>
                        </div>
                        <small className="text-muted">
                          Avg opponent rank: #{player.avgOpponentRank}
                        </small>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary Statistics */}
          <div className="row mt-4">
            <div className="col-12">
              <div className="card bg-light">
                <div className="card-body">
                  <h6 className="card-title">Performance Insights</h6>
                  <div className="row">
                    <div className="col-md-3">
                      <div className="text-center">
                        <div className="h4 text-success mb-0">
                          {sortedPlayers.filter(p => p.recentForm >= 80).length}
                        </div>
                        <small className="text-muted">Hot Streaks</small>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="text-center">
                        <div className="h4 text-primary mb-0">
                          {Math.round(sortedPlayers.reduce((sum, p) => sum + p.avgMargin, 0) / sortedPlayers.length * 10) / 10}
                        </div>
                        <small className="text-muted">Avg Margin</small>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="text-center">
                        <div className="h4 text-warning mb-0">
                          {sortedPlayers.filter(p => p.currentStreak > 2).length}
                        </div>
                        <small className="text-muted">Active Streaks</small>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="text-center">
                        <div className="h4 text-info mb-0">
                          {Math.round(sortedPlayers.reduce((sum, p) => sum + p.gamesPlayed, 0) / sortedPlayers.length)}
                        </div>
                        <small className="text-muted">Avg Games</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );

  } catch (error) {
    console.error('Error in SimplePlayerPerformanceChart:', error);
    return (
      <div className="card">
        <div className="card-header">
          <h3 className="card-title mb-0">Player Performance Analysis</h3>
        </div>
        <div className="card-body text-center text-danger">
          <p>Error loading performance data</p>
          <small className="text-muted">{error.message}</small>
        </div>
      </div>
    );
  }
};

export default SimplePlayerPerformanceChart;