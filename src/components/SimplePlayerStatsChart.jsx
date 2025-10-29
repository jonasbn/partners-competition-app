import React from 'react';
import { getLeaderboardData, getGames } from '../utils/dataUtils';
import SimpleAvatarWithHover from './AvatarWithHover';

const SimplePlayerStatsChart = () => {
  try {
    const leaderboardData = getLeaderboardData();
    const games = getGames();

    if (!leaderboardData?.length || !games?.length) {
      return (
        <div className="card">
          <div className="card-header">
            <h3 className="card-title mb-0">Player Statistics Chart</h3>
          </div>
          <div className="card-body text-center text-muted">
            <p>No player statistics available</p>
          </div>
        </div>
      );
    }

    // Calculate comprehensive stats for each player
    const playerStats = leaderboardData.map((player, index) => {
      // Get all games for this player
      const playerGames = games.filter(game => 
        game.player1?.toLowerCase() === player.name?.toLowerCase() || 
        game.player2?.toLowerCase() === player.name?.toLowerCase()
      );

      if (playerGames.length === 0) {
        return {
          ...player,
          rank: index + 1,
          gamesPlayed: 0,
          wins: 0,
          losses: 0,
          winRate: 0,
          totalPointsScored: 0,
          totalPointsConceded: 0,
          avgPointsScored: 0,
          avgPointsConceded: 0,
          pointDifferential: 0,
          biggestWin: 0,
          biggestLoss: 0,
          perfectGames: 0,
          closeGames: 0,
          blowouts: 0,
          dominanceRatio: 0
        };
      }

      // Calculate basic stats
      let wins = 0;
      let losses = 0;
      let totalPointsScored = 0;
      let totalPointsConceded = 0;
      let biggestWin = 0;
      let biggestLoss = 0;
      let perfectGames = 0;
      let closeGames = 0;
      let blowouts = 0;

      playerGames.forEach(game => {
        const isPlayer1 = game.player1?.toLowerCase() === player.name?.toLowerCase();
        const playerScore = isPlayer1 ? game.score1 : game.score2;
        const opponentScore = isPlayer1 ? game.score2 : game.score1;
        
        totalPointsScored += playerScore;
        totalPointsConceded += opponentScore;

        if (playerScore > opponentScore) {
          wins++;
          const margin = playerScore - opponentScore;
          if (margin > biggestWin) biggestWin = margin;
          if (opponentScore === 0) perfectGames++;
          if (margin >= 5) blowouts++;
          else if (margin <= 2) closeGames++;
        } else {
          losses++;
          const margin = opponentScore - playerScore;
          if (margin > biggestLoss) biggestLoss = margin;
          if (margin <= 2) closeGames++;
        }
      });

      const winRate = playerGames.length > 0 ? (wins / playerGames.length) * 100 : 0;
      const avgPointsScored = playerGames.length > 0 ? totalPointsScored / playerGames.length : 0;
      const avgPointsConceded = playerGames.length > 0 ? totalPointsConceded / playerGames.length : 0;
      const pointDifferential = avgPointsScored - avgPointsConceded;

      // Calculate dominance ratio (ability to win decisively)
      const dominanceRatio = wins > 0 ? (blowouts / wins) * 100 : 0;

      return {
        ...player,
        rank: index + 1,
        gamesPlayed: playerGames.length,
        wins,
        losses,
        winRate: Math.round(winRate * 10) / 10,
        totalPointsScored,
        totalPointsConceded,
        avgPointsScored: Math.round(avgPointsScored * 10) / 10,
        avgPointsConceded: Math.round(avgPointsConceded * 10) / 10,
        pointDifferential: Math.round(pointDifferential * 10) / 10,
        biggestWin,
        biggestLoss,
        perfectGames,
        closeGames,
        blowouts,
        dominanceRatio: Math.round(dominanceRatio * 10) / 10
      };
    });

    // Sort by points for consistency
    const sortedPlayers = [...playerStats].sort((a, b) => (b.points || 0) - (a.points || 0));

    // Calculate league statistics
    const totalGames = sortedPlayers.reduce((sum, p) => sum + p.gamesPlayed, 0) / 2; // Divide by 2 since each game counts for 2 players
    const avgPointsPerGame = sortedPlayers.reduce((sum, p) => sum + p.avgPointsScored, 0) / sortedPlayers.length;
    const mostActivePlayer = sortedPlayers.reduce((max, p) => p.gamesPlayed > max.gamesPlayed ? p : max, sortedPlayers[0] || {});
    const bestWinRatePlayer = sortedPlayers.filter(p => p.gamesPlayed >= 3).reduce((max, p) => p.winRate > max.winRate ? p : max, sortedPlayers[0] || {});

    // Helper functions
    const getStatColor = (value, type) => {
      switch (type) {
        case 'winRate':
          if (value >= 70) return 'success';
          if (value >= 50) return 'primary';
          if (value >= 30) return 'warning';
          return 'danger';
        case 'differential':
          if (value >= 2) return 'success';
          if (value >= 0) return 'primary';
          if (value >= -2) return 'warning';
          return 'danger';
        case 'dominance':
          if (value >= 60) return 'success';
          if (value >= 40) return 'primary';
          if (value >= 20) return 'warning';
          return 'secondary';
        default:
          return 'primary';
      }
    };

    const getPlayerType = (player) => {
      if (player.gamesPlayed < 3) return { type: 'Rookie', icon: '🆕', color: 'secondary' };
      if (player.winRate >= 70 && player.dominanceRatio >= 50) return { type: 'Dominator', icon: '👑', color: 'success' };
      if (player.winRate >= 60) return { type: 'Competitor', icon: '⚔️', color: 'primary' };
      if (player.closeGames >= player.gamesPlayed * 0.4) return { type: 'Clutch Player', icon: '🎯', color: 'warning' };
      if (player.avgPointsScored >= avgPointsPerGame * 1.1) return { type: 'Scorer', icon: '🔥', color: 'danger' };
      if (player.pointDifferential >= 0) return { type: 'Balanced', icon: '⚖️', color: 'info' };
      return { type: 'Developing', icon: '📈', color: 'secondary' };
    };

    return (
      <div className="card">
        <div className="card-header">
          <h3 className="card-title mb-0">Player Statistics Analysis</h3>
          <small className="text-muted">Comprehensive performance metrics and player profiles</small>
        </div>
        <div className="card-body">
          {/* League Overview */}
          <div className="row mb-4">
            <div className="col-md-3">
              <div className="card bg-primary text-white">
                <div className="card-body text-center">
                  <h4 className="mb-0">{Math.round(totalGames)}</h4>
                  <small>Total Games</small>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card bg-info text-white">
                <div className="card-body text-center">
                  <h4 className="mb-0">{Math.round(avgPointsPerGame * 10) / 10}</h4>
                  <small>Avg Points/Game</small>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card bg-success text-white">
                <div className="card-body text-center">
                  <h4 className="mb-0">{bestWinRatePlayer?.winRate || 0}%</h4>
                  <small>Best Win Rate</small>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card bg-warning text-white">
                <div className="card-body text-center">
                  <h4 className="mb-0">{mostActivePlayer?.gamesPlayed || 0}</h4>
                  <small>Most Games</small>
                </div>
              </div>
            </div>
          </div>

          {/* Player Stats Grid */}
          <div className="row">
            {sortedPlayers.map((player, index) => {
              const playerType = getPlayerType(player);
              
              return (
                <div key={player.name || index} className="col-lg-4 col-md-6 mb-4">
                  <div className="card h-100">
                    <div className="card-body">
                      {/* Player Header */}
                      <div className="d-flex align-items-center mb-3">
                        <SimpleAvatarWithHover 
                          playerName={player.name} 
                          rank={player.rank}
                          size="sm"
                        />
                        <div className="ms-2 flex-grow-1">
                          <h6 className="mb-0">{player.name || 'Unknown'}</h6>
                          <small className="text-muted">#{player.rank} • {player.points || 0} pts</small>
                        </div>
                        <span className={`badge bg-${playerType.color}`}>
                          {playerType.icon} {playerType.type}
                        </span>
                      </div>

                      {/* Win Rate */}
                      <div className="mb-3">
                        <div className="d-flex justify-content-between align-items-center mb-1">
                          <small className="text-muted">Win Rate</small>
                          <span className={`badge bg-${getStatColor(player.winRate, 'winRate')}`}>
                            {player.winRate}%
                          </span>
                        </div>
                        <div className="progress" style={{ height: '6px' }}>
                          <div 
                            className={`progress-bar bg-${getStatColor(player.winRate, 'winRate')}`}
                            style={{ width: `${player.winRate}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Game Stats */}
                      <div className="row g-2 mb-3">
                        <div className="col-4">
                          <div className="text-center p-2 bg-light rounded">
                            <div className="fw-bold text-success">{player.wins}</div>
                            <small className="text-muted">Wins</small>
                          </div>
                        </div>
                        <div className="col-4">
                          <div className="text-center p-2 bg-light rounded">
                            <div className="fw-bold text-danger">{player.losses}</div>
                            <small className="text-muted">Losses</small>
                          </div>
                        </div>
                        <div className="col-4">
                          <div className="text-center p-2 bg-light rounded">
                            <div className="fw-bold text-primary">{player.gamesPlayed}</div>
                            <small className="text-muted">Games</small>
                          </div>
                        </div>
                      </div>

                      {/* Scoring Stats */}
                      <div className="mb-3">
                        <div className="d-flex justify-content-between mb-1">
                          <small className="text-muted">Avg Scored</small>
                          <span className="fw-bold text-primary">{player.avgPointsScored}</span>
                        </div>
                        <div className="d-flex justify-content-between mb-1">
                          <small className="text-muted">Avg Conceded</small>
                          <span className="fw-bold text-warning">{player.avgPointsConceded}</span>
                        </div>
                        <div className="d-flex justify-content-between">
                          <small className="text-muted">Differential</small>
                          <span className={`fw-bold text-${getStatColor(player.pointDifferential, 'differential')}`}>
                            {player.pointDifferential > 0 ? '+' : ''}{player.pointDifferential}
                          </span>
                        </div>
                      </div>

                      {/* Special Stats */}
                      {player.gamesPlayed > 0 && (
                        <div className="row g-2 mb-3">
                          {player.perfectGames > 0 && (
                            <div className="col-6">
                              <div className="text-center p-1 bg-success text-white rounded">
                                <div className="small fw-bold">{player.perfectGames}</div>
                                <small>Shutouts</small>
                              </div>
                            </div>
                          )}
                          {player.blowouts > 0 && (
                            <div className="col-6">
                              <div className="text-center p-1 bg-primary text-white rounded">
                                <div className="small fw-bold">{player.blowouts}</div>
                                <small>Blowouts</small>
                              </div>
                            </div>
                          )}
                          {player.closeGames > 0 && (
                            <div className="col-6">
                              <div className="text-center p-1 bg-warning text-white rounded">
                                <div className="small fw-bold">{player.closeGames}</div>
                                <small>Close Games</small>
                              </div>
                            </div>
                          )}
                          {player.biggestWin > 0 && (
                            <div className="col-6">
                              <div className="text-center p-1 bg-info text-white rounded">
                                <div className="small fw-bold">+{player.biggestWin}</div>
                                <small>Best Win</small>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Dominance Ratio */}
                      {player.wins > 0 && (
                        <div className="mb-0">
                          <div className="d-flex justify-content-between align-items-center">
                            <small className="text-muted">Dominance</small>
                            <span className={`badge bg-${getStatColor(player.dominanceRatio, 'dominance')}`}>
                              {player.dominanceRatio}%
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Player Insights */}
          <div className="mt-4">
            <div className="card bg-light">
              <div className="card-body">
                <h6 className="card-title">League Insights</h6>
                <div className="row">
                  <div className="col-md-4">
                    <h6 className="text-success">🏆 Best Win Rate</h6>
                    <p className="mb-2">
                      <strong>{bestWinRatePlayer?.name}</strong>
                    </p>
                    <small className="text-muted">
                      {bestWinRatePlayer?.winRate}% • {bestWinRatePlayer?.wins}W-{bestWinRatePlayer?.losses}L •
                      {bestWinRatePlayer?.pointDifferential > 0 ? '+' : ''}{bestWinRatePlayer?.pointDifferential} diff
                    </small>
                  </div>
                  <div className="col-md-4">
                    <h6 className="text-primary">🔥 Most Active</h6>
                    <p className="mb-2">
                      <strong>{mostActivePlayer?.name}</strong>
                    </p>
                    <small className="text-muted">
                      {mostActivePlayer?.gamesPlayed} games • {mostActivePlayer?.winRate}% win rate •
                      {mostActivePlayer?.pointDifferential > 0 ? '+' : ''}{mostActivePlayer?.pointDifferential} diff
                    </small>
                  </div>
                  <div className="col-md-4">
                    <h6 className="text-warning">⚔️ Competition Level</h6>
                    <p className="mb-2">
                      <strong>{avgPointsPerGame > 4 ? 'High Scoring' : 'Defensive'}</strong>
                    </p>
                    <small className="text-muted">
                      {Math.round(avgPointsPerGame * 10) / 10} avg points per game •
                      {sortedPlayers.filter(p => p.winRate >= 60 && p.gamesPlayed >= 3).length} strong players
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );

  } catch (error) {
    console.error('Error in SimplePlayerStatsChart:', error);
    return (
      <div className="card">
        <div className="card-header">
          <h3 className="card-title mb-0">Player Statistics Analysis</h3>
        </div>
        <div className="card-body text-center text-danger">
          <p>Error loading player statistics</p>
          <small className="text-muted">{error.message}</small>
        </div>
      </div>
    );
  }
};

export default SimplePlayerStatsChart;