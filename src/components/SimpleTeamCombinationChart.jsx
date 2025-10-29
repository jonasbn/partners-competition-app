import React from 'react';
import { getLeaderboardData, getGames } from '../utils/dataUtils';
import SimpleAvatarWithHover from './AvatarWithHover';

const SimpleTeamCombinationChart = () => {
  try {
    const leaderboardData = getLeaderboardData();
    const games = getGames();

    if (!leaderboardData?.length || !games?.length) {
      return (
        <div className="card">
          <div className="card-header">
            <h3 className="card-title mb-0">Team Combination Analysis</h3>
          </div>
          <div className="card-body text-center text-muted">
            <p>No team combination data available</p>
          </div>
        </div>
      );
    }

    // Extract all unique team combinations from games
    const teamCombinations = {};
    
    games.forEach(game => {
      if (!game.player1 || !game.player2) return;
      
      // Create a consistent key for the team (alphabetically sorted)
      const players = [game.player1.toLowerCase(), game.player2.toLowerCase()].sort();
      const teamKey = `${players[0]}_${players[1]}`;
      
      if (!teamCombinations[teamKey]) {
        teamCombinations[teamKey] = {
          player1: players[0],
          player2: players[1],
          games: [],
          wins: 0,
          losses: 0,
          totalPoints: 0,
          totalOpponentPoints: 0
        };
      }
      
      teamCombinations[teamKey].games.push(game);
      
      // Determine if this team won
      const teamWon = game.score1 > game.score2;
      if (teamWon) {
        teamCombinations[teamKey].wins++;
        teamCombinations[teamKey].totalPoints += game.score1;
        teamCombinations[teamKey].totalOpponentPoints += game.score2;
      } else {
        teamCombinations[teamKey].losses++;
        teamCombinations[teamKey].totalPoints += game.score2;
        teamCombinations[teamKey].totalOpponentPoints += game.score1;
      }
    });

    // Calculate team statistics
    const teamStats = Object.values(teamCombinations).map(team => {
      const totalGames = team.wins + team.losses;
      const winRate = totalGames > 0 ? (team.wins / totalGames) * 100 : 0;
      const avgPointsFor = totalGames > 0 ? team.totalPoints / totalGames : 0;
      const avgPointsAgainst = totalGames > 0 ? team.totalOpponentPoints / totalGames : 0;
      const pointDifferential = avgPointsFor - avgPointsAgainst;
      
      // Get player ranks for analysis
      const player1Data = leaderboardData.find(p => p.name?.toLowerCase() === team.player1);
      const player2Data = leaderboardData.find(p => p.name?.toLowerCase() === team.player2);
      const player1Rank = player1Data ? leaderboardData.indexOf(player1Data) + 1 : 999;
      const player2Rank = player2Data ? leaderboardData.indexOf(player2Data) + 1 : 999;
      const avgRank = (player1Rank + player2Rank) / 2;
      
      // Calculate recent form (last 3 games)
      const recentGames = team.games.slice(-3);
      const recentWins = recentGames.filter(game => {
        return game.score1 > game.score2;
      }).length;
      const recentForm = recentGames.length > 0 ? (recentWins / recentGames.length) * 100 : 0;

      return {
        ...team,
        player1Name: player1Data?.name || team.player1,
        player2Name: player2Data?.name || team.player2,
        player1Rank,
        player2Rank,
        avgRank,
        totalGames,
        winRate: Math.round(winRate * 10) / 10,
        avgPointsFor: Math.round(avgPointsFor * 10) / 10,
        avgPointsAgainst: Math.round(avgPointsAgainst * 10) / 10,
        pointDifferential: Math.round(pointDifferential * 10) / 10,
        recentForm: Math.round(recentForm * 10) / 10,
        recentGamesCount: recentGames.length,
        efficiency: totalGames > 0 ? Math.round((winRate * pointDifferential / 10) * 10) / 10 : 0
      };
    });

    // Sort teams by win rate, then by games played
    const sortedTeams = teamStats
      .filter(team => team.totalGames >= 2) // Only show teams with at least 2 games
      .sort((a, b) => {
        if (Math.abs(a.winRate - b.winRate) < 5) {
          return b.totalGames - a.totalGames; // If win rates are similar, prefer more games
        }
        return b.winRate - a.winRate;
      });

    // Calculate overall statistics
    const totalCombinations = sortedTeams.length;
    const avgWinRate = sortedTeams.length > 0 ? sortedTeams.reduce((sum, team) => sum + team.winRate, 0) / sortedTeams.length : 0;
    const mostActiveTeam = sortedTeams.reduce((max, team) => team.totalGames > max.totalGames ? team : max, sortedTeams[0] || {});
    const bestTeam = sortedTeams[0];

    // Helper functions
    const getWinRateColor = (winRate) => {
      if (winRate >= 70) return 'success';
      if (winRate >= 50) return 'primary';
      if (winRate >= 30) return 'warning';
      return 'danger';
    };

    const getFormColor = (form) => {
      if (form >= 75) return 'success';
      if (form >= 50) return 'warning';
      return 'danger';
    };

    const getTeamSynergy = (winRate, avgRank) => {
      // Expected win rate based on average rank (lower rank = higher expected win rate)
      const expectedWinRate = Math.max(20, 80 - (avgRank - 1) * 10);
      const synergy = winRate - expectedWinRate;
      
      if (synergy > 15) return { level: 'Excellent', color: 'success', icon: '🔥' };
      if (synergy > 5) return { level: 'Good', color: 'primary', icon: '👍' };
      if (synergy > -5) return { level: 'Expected', color: 'secondary', icon: '➖' };
      if (synergy > -15) return { level: 'Below Par', color: 'warning', icon: '👎' };
      return { level: 'Poor', color: 'danger', icon: '💔' };
    };

    return (
      <div className="card">
        <div className="card-header">
          <h3 className="card-title mb-0">Team Combination Analysis</h3>
          <small className="text-muted">Partnership performance and team synergy insights</small>
        </div>
        <div className="card-body">
          {/* Summary Statistics */}
          <div className="row mb-4">
            <div className="col-md-3">
              <div className="card bg-primary text-white">
                <div className="card-body text-center">
                  <h4 className="mb-0">{totalCombinations}</h4>
                  <small>Active Teams</small>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card bg-info text-white">
                <div className="card-body text-center">
                  <h4 className="mb-0">{Math.round(avgWinRate)}%</h4>
                  <small>Avg Win Rate</small>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card bg-success text-white">
                <div className="card-body text-center">
                  <h4 className="mb-0">{bestTeam?.totalGames || 0}</h4>
                  <small>Top Team Games</small>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card bg-warning text-white">
                <div className="card-body text-center">
                  <h4 className="mb-0">{mostActiveTeam?.totalGames || 0}</h4>
                  <small>Most Active</small>
                </div>
              </div>
            </div>
          </div>

          {/* Team Combinations Grid */}
          <div className="row">
            {sortedTeams.slice(0, 12).map((team, index) => {
              const synergyInfo = getTeamSynergy(team.winRate, team.avgRank);
              
              return (
                <div key={`${team.player1}_${team.player2}`} className="col-lg-4 col-md-6 mb-4">
                  <div className="card h-100">
                    <div className="card-body">
                      {/* Team Header */}
                      <div className="d-flex align-items-center mb-3">
                        <div className="d-flex align-items-center">
                          <SimpleAvatarWithHover 
                            playerName={team.player1Name} 
                            rank={team.player1Rank}
                            size="sm"
                          />
                          <span className="mx-2">+</span>
                          <SimpleAvatarWithHover 
                            playerName={team.player2Name} 
                            rank={team.player2Rank}
                            size="sm"
                          />
                        </div>
                        <div className="ms-auto">
                          <span className="badge bg-secondary">#{index + 1}</span>
                        </div>
                      </div>

                      {/* Team Names */}
                      <h6 className="card-title text-center mb-3">
                        {team.player1Name} & {team.player2Name}
                      </h6>

                      {/* Win Rate */}
                      <div className="mb-3">
                        <div className="d-flex justify-content-between align-items-center mb-1">
                          <small className="text-muted">Win Rate</small>
                          <span className={`badge bg-${getWinRateColor(team.winRate)}`}>
                            {team.winRate}%
                          </span>
                        </div>
                        <div className="progress" style={{ height: '8px' }}>
                          <div 
                            className={`progress-bar bg-${getWinRateColor(team.winRate)}`}
                            style={{ width: `${team.winRate}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Team Stats */}
                      <div className="row g-2 mb-3">
                        <div className="col-4">
                          <div className="text-center p-2 bg-light rounded">
                            <div className="fw-bold text-success">{team.wins}</div>
                            <small className="text-muted">Wins</small>
                          </div>
                        </div>
                        <div className="col-4">
                          <div className="text-center p-2 bg-light rounded">
                            <div className="fw-bold text-danger">{team.losses}</div>
                            <small className="text-muted">Losses</small>
                          </div>
                        </div>
                        <div className="col-4">
                          <div className="text-center p-2 bg-light rounded">
                            <div className="fw-bold text-primary">{team.totalGames}</div>
                            <small className="text-muted">Games</small>
                          </div>
                        </div>
                      </div>

                      {/* Recent Form */}
                      {team.recentGamesCount > 0 && (
                        <div className="mb-3">
                          <div className="d-flex justify-content-between align-items-center mb-1">
                            <small className="text-muted">Recent Form</small>
                            <span className={`badge bg-${getFormColor(team.recentForm)}`}>
                              {team.recentForm}%
                            </span>
                          </div>
                          <small className="text-muted">Last {team.recentGamesCount} games</small>
                        </div>
                      )}

                      {/* Team Synergy */}
                      <div className="mb-2">
                        <div className="d-flex justify-content-between align-items-center">
                          <small className="text-muted">Team Synergy</small>
                          <span className={`badge bg-${synergyInfo.color}`}>
                            {synergyInfo.icon} {synergyInfo.level}
                          </span>
                        </div>
                      </div>

                      {/* Point Differential */}
                      <div className="mb-0">
                        <div className="d-flex justify-content-between align-items-center">
                          <small className="text-muted">Avg Margin</small>
                          <span className={`fw-bold ${team.pointDifferential > 0 ? 'text-success' : 'text-danger'}`}>
                            {team.pointDifferential > 0 ? '+' : ''}{team.pointDifferential}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Additional Insights */}
          {sortedTeams.length > 0 && (
            <div className="mt-4">
              <div className="card bg-light">
                <div className="card-body">
                  <h6 className="card-title">Partnership Insights</h6>
                  <div className="row">
                    <div className="col-md-6">
                      <h6 className="text-success">🏆 Best Partnership</h6>
                      <p className="mb-2">
                        <strong>{bestTeam?.player1Name} & {bestTeam?.player2Name}</strong>
                      </p>
                      <small className="text-muted">
                        {bestTeam?.winRate}% win rate • {bestTeam?.totalGames} games • 
                        {bestTeam?.pointDifferential > 0 ? '+' : ''}{bestTeam?.pointDifferential} avg margin
                      </small>
                    </div>
                    <div className="col-md-6">
                      <h6 className="text-primary">🔥 Most Active</h6>
                      <p className="mb-2">
                        <strong>{mostActiveTeam?.player1Name} & {mostActiveTeam?.player2Name}</strong>
                      </p>
                      <small className="text-muted">
                        {mostActiveTeam?.totalGames} games • {mostActiveTeam?.winRate}% win rate • 
                        {mostActiveTeam?.pointDifferential > 0 ? '+' : ''}{mostActiveTeam?.pointDifferential} avg margin
                      </small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );

  } catch (error) {
    console.error('Error in SimpleTeamCombinationChart:', error);
    return (
      <div className="card">
        <div className="card-header">
          <h3 className="card-title mb-0">Team Combination Analysis</h3>
        </div>
        <div className="card-body text-center text-danger">
          <p>Error loading team combination data</p>
          <small className="text-muted">{error.message}</small>
        </div>
      </div>
    );
  }
};

export default SimpleTeamCombinationChart;