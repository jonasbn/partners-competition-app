import React from 'react';
import { getTeamStatistics } from '../utils/dataUtils';
import SimpleAvatarWithHover from './SimpleAvatarWithHover';
import { getRankBasedAvatar } from '../utils/simpleAvatarUtils';

const SimpleTeamStatistics = () => {
  console.log('SimpleTeamStatistics rendering...');
  
  let teamStats = [];
  let dataError = null;

  try {
    teamStats = getTeamStatistics() || [];
    console.log('Team statistics loaded:', teamStats.length, 'teams');
  } catch (error) {
    console.error('Error loading team statistics:', error);
    dataError = error.message;
  }

  if (dataError) {
    return (
      <div className="card">
        <div className="card-header bg-danger text-white">
          <h2>❌ Team Statistics Error</h2>
        </div>
        <div className="card-body">
          <div className="alert alert-danger">
            <strong>Error:</strong> {dataError}
          </div>
        </div>
      </div>
    );
  }

  if (!teamStats || teamStats.length === 0) {
    return (
      <div className="card">
        <div className="card-header bg-info text-white">
          <h2>👯 Team Statistics</h2>
        </div>
        <div className="card-body">
          <div className="alert alert-info">
            <h4>No team data available</h4>
            <p>Play some games to see team statistics here!</p>
          </div>
        </div>
      </div>
    );
  }

  // Function to get team avatar based on ranking
  const getTeamRankingClass = (rank) => {
    if (rank === 1) return 'table-success';
    if (rank <= 3) return 'table-warning';
    return '';
  };

  const getRankIcon = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `${rank}.`;
  };

  return (
    <div className="card mb-4">
      <div className="card-header bg-primary text-white">
        <h2>👯 Team Statistics</h2>
      </div>
      <div className="card-body">
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead className="table-dark">
              <tr>
                <th>Rank</th>
                <th>Team</th>
                <th>Games</th>
                <th>Wins</th>
                <th>2nd Place</th>
                <th>3rd Place</th>
                <th>Win Rate</th>
                <th>Total Points</th>
              </tr>
            </thead>
            <tbody>
              {teamStats.map((team, index) => {
                const rank = index + 1;
                const players = team.players || [];
                const gamesPlayed = team.gamesPlayed || 0;
                const wins = team.wins || 0;
                const seconds = team.seconds || 0;
                const thirds = team.thirds || 0;
                const winRate = team.winRate || 0;
                const totalPoints = team.totalPoints || 0;

                return (
                  <tr key={`${players.join('-')}-${index}`} className={getTeamRankingClass(rank)}>
                    <td>
                      <strong>{getRankIcon(rank)}</strong>
                    </td>
                    <td>
                      <div className="d-flex align-items-center">
                        {players.map((player, playerIdx) => {
                          try {
                            // Use team ranking for avatar selection (top 3 teams get better avatars)
                            const avatarRank = rank <= 3 ? 1 : 4; // Top 3 teams get happy, others get sad
                            return (
                              <div key={`${player}-${playerIdx}`} className="d-flex align-items-center me-2">
                                <SimpleAvatarWithHover
                                  playerName={player}
                                  avatarSrc={getRankBasedAvatar(player, avatarRank)}
                                  size={24}
                                  className="me-1"
                                />
                                <span className="small">{player}</span>
                                {playerIdx < players.length - 1 && <span className="mx-1">&</span>}
                              </div>
                            );
                          } catch (error) {
                            console.error('Error rendering team player avatar:', error);
                            return (
                              <span key={`${player}-${playerIdx}`} className="me-2">
                                {player}
                                {playerIdx < players.length - 1 && ' & '}
                              </span>
                            );
                          }
                        })}
                      </div>
                    </td>
                    <td>
                      <span className="badge bg-secondary">{gamesPlayed}</span>
                    </td>
                    <td>
                      <span className="badge bg-success">{wins}</span>
                    </td>
                    <td>
                      <span className="badge bg-warning">{seconds}</span>
                    </td>
                    <td>
                      <span className="badge bg-info">{thirds}</span>
                    </td>
                    <td>
                      <span className={`badge ${winRate >= 50 ? 'bg-success' : 'bg-secondary'}`}>
                        {winRate.toFixed(1)}%
                      </span>
                    </td>
                    <td>
                      <strong className="text-primary">{totalPoints}</strong>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        <div className="mt-3">
          <div className="row">
            <div className="col-md-6">
              <small className="text-muted">
                <strong>Total teams:</strong> {teamStats.length} | 
                <strong>Total games tracked:</strong> {teamStats.reduce((sum, team) => sum + (team.gamesPlayed || 0), 0)}
              </small>
            </div>
            <div className="col-md-6 text-end">
              <small className="text-muted">
                <strong>Ranking:</strong> By total points, then win rate
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleTeamStatistics;