import React from 'react';
import { getLeaderboardData } from '../utils/dataUtils';
import SimpleAvatarWithHover from './SimpleAvatarWithHover';
import { getRankBasedAvatar } from '../utils/simpleAvatarUtils';

const SimplePointsDistribution = () => {
  console.log('SimplePointsDistribution rendering...');
  
  let players = [];
  let dataError = null;

  try {
    const leaderboardData = getLeaderboardData();
    players = leaderboardData?.players || [];
    console.log('Points distribution data loaded:', players.length, 'players');
  } catch (error) {
    console.error('Error loading points distribution data:', error);
    dataError = error.message;
  }

  if (dataError) {
    return (
      <div className="card">
        <div className="card-header bg-danger text-white">
          <h2>❌ Points Distribution Error</h2>
        </div>
        <div className="card-body">
          <div className="alert alert-danger">
            <strong>Error:</strong> {dataError}
          </div>
        </div>
      </div>
    );
  }

  if (!players || players.length === 0) {
    return (
      <div className="card">
        <div className="card-header bg-info text-white">
          <h2>📊 Points Distribution</h2>
        </div>
        <div className="card-body">
          <div className="alert alert-info">
            <h4>No points data available</h4>
            <p>Play some games to see points distribution here!</p>
          </div>
        </div>
      </div>
    );
  }

  // Sort players by points
  const sortedPlayers = [...players].sort((a, b) => b.cumulativeScore - a.cumulativeScore);
  
  // Calculate distribution statistics
  const totalPoints = sortedPlayers.reduce((sum, player) => sum + (player.cumulativeScore || 0), 0);
  const avgPoints = totalPoints > 0 ? (totalPoints / sortedPlayers.length).toFixed(1) : 0;
  const maxPoints = sortedPlayers.length > 0 ? sortedPlayers[0].cumulativeScore : 0;
  const minPoints = sortedPlayers.length > 0 ? sortedPlayers[sortedPlayers.length - 1].cumulativeScore : 0;
  const pointsRange = maxPoints - minPoints;
  
  // Calculate point ranges for distribution
  const getPointsCategory = (points) => {
    if (points >= maxPoints * 0.8) return 'high';
    if (points >= maxPoints * 0.6) return 'upper-mid';
    if (points >= maxPoints * 0.4) return 'mid';
    if (points >= maxPoints * 0.2) return 'lower-mid';
    return 'low';
  };

  const getCategoryInfo = (category) => {
    switch (category) {
      case 'high': return { label: 'Top Tier', class: 'success', icon: '🏆' };
      case 'upper-mid': return { label: 'Upper Mid', class: 'primary', icon: '🥈' };
      case 'mid': return { label: 'Middle', class: 'warning', icon: '🥉' };
      case 'lower-mid': return { label: 'Lower Mid', class: 'info', icon: '📈' };
      case 'low': return { label: 'Developing', class: 'secondary', icon: '💪' };
      default: return { label: 'Unknown', class: 'light', icon: '❓' };
    }
  };

  // Group players by category
  const distribution = sortedPlayers.reduce((acc, player) => {
    const points = player.cumulativeScore || 0;
    const category = getPointsCategory(points);
    if (!acc[category]) acc[category] = [];
    acc[category].push(player);
    return acc;
  }, {});

  const categories = ['high', 'upper-mid', 'mid', 'lower-mid', 'low'];

  return (
    <div className="card mb-4">
      <div className="card-header bg-primary text-white">
        <h2>📊 Points Distribution Analysis</h2>
      </div>
      <div className="card-body">
        {/* Distribution Stats */}
        <div className="row mb-4">
          <div className="col-md-3">
            <div className="text-center">
              <div className="h4 text-primary">{totalPoints}</div>
              <small className="text-muted">Total Points</small>
            </div>
          </div>
          <div className="col-md-3">
            <div className="text-center">
              <div className="h4 text-success">{avgPoints}</div>
              <small className="text-muted">Average</small>
            </div>
          </div>
          <div className="col-md-3">
            <div className="text-center">
              <div className="h4 text-warning">{maxPoints}</div>
              <small className="text-muted">Highest</small>
            </div>
          </div>
          <div className="col-md-3">
            <div className="text-center">
              <div className="h4 text-info">{pointsRange}</div>
              <small className="text-muted">Point Spread</small>
            </div>
          </div>
        </div>

        {/* Visual Distribution */}
        <div className="mb-4">
          <h5>📈 Distribution Visualization</h5>
          <div className="row">
            {sortedPlayers.map((player, index) => {
              const points = player.cumulativeScore || 0;
              const percentage = maxPoints > 0 ? (points / maxPoints) * 100 : 0;
              const category = getPointsCategory(points);
              const categoryInfo = getCategoryInfo(category);
              
              return (
                <div key={`${player.name}-${index}`} className="col-md-6 col-lg-4 mb-3">
                  <div className={`card border-${categoryInfo.class}`}>
                    <div className={`card-header bg-${categoryInfo.class} text-white`}>
                      <div className="d-flex align-items-center justify-content-between">
                        <span className="small">#{index + 1} {categoryInfo.label}</span>
                        <span>{categoryInfo.icon}</span>
                      </div>
                    </div>
                    <div className="card-body text-center p-3">
                      <div className="mb-2">
                        <SimpleAvatarWithHover
                          playerName={player.name}
                          avatarSrc={getRankBasedAvatar(player.name, index + 1)}
                          size={40}
                        />
                      </div>
                      <h6 className="mb-2">{player.name}</h6>
                      <div className="h5 text-primary mb-2">{points}</div>
                      
                      {/* Points bar visualization */}
                      <div className="progress mb-2" style={{height: '8px'}}>
                        <div 
                          className={`progress-bar bg-${categoryInfo.class}`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      
                      <div className="row text-center">
                        <div className="col-6">
                          <small className="text-muted">
                            {percentage.toFixed(1)}%<br/>of leader
                          </small>
                        </div>
                        <div className="col-6">
                          <small className="text-muted">
                            {player.gamesPlayed || 0}<br/>games
                          </small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Distribution Summary */}
        <div className="row mb-4">
          <div className="col-12">
            <h5>📋 Distribution Summary</h5>
            <div className="table-responsive">
              <table className="table table-sm">
                <thead>
                  <tr>
                    <th>Tier</th>
                    <th>Players</th>
                    <th>Point Range</th>
                    <th>Percentage</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map(category => {
                    const categoryPlayers = distribution[category] || [];
                    const categoryInfo = getCategoryInfo(category);
                    const minCategoryPoints = Math.min(...(categoryPlayers.map(p => p.cumulativeScore || 0).concat([maxPoints])));
                    const maxCategoryPoints = Math.max(...(categoryPlayers.map(p => p.cumulativeScore || 0).concat([0])));
                    const categoryPercentage = sortedPlayers.length > 0 ? 
                      ((categoryPlayers.length / sortedPlayers.length) * 100).toFixed(1) : 0;
                    
                    return categoryPlayers.length > 0 ? (
                      <tr key={category}>
                        <td>
                          <span className={`badge bg-${categoryInfo.class} me-2`}>
                            {categoryInfo.icon}
                          </span>
                          {categoryInfo.label}
                        </td>
                        <td>{categoryPlayers.length}</td>
                        <td>
                          {minCategoryPoints === maxCategoryPoints ? 
                            maxCategoryPoints : 
                            `${minCategoryPoints}-${maxCategoryPoints}`}
                        </td>
                        <td>{categoryPercentage}%</td>
                      </tr>
                    ) : null;
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Competition Balance Analysis */}
        <div className="alert alert-light">
          <h6>⚖️ Competition Balance</h6>
          <div className="row">
            <div className="col-md-4">
              <strong>Point Spread:</strong> {pointsRange} points
            </div>
            <div className="col-md-4">
              <strong>Competition Level:</strong> {
                pointsRange <= avgPoints * 0.5 ? '🔥 Very Competitive' :
                pointsRange <= avgPoints ? '👍 Competitive' :
                '📈 Developing'
              }
            </div>
            <div className="col-md-4">
              <strong>Leader Advantage:</strong> {
                maxPoints > 0 ? `${((maxPoints - minPoints) / maxPoints * 100).toFixed(1)}%` : '0%'
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimplePointsDistribution;