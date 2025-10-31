import React from 'react';
import { useTranslation } from 'react-i18next';
import { getLeaderboardData } from '../utils/dataUtils';
import SimpleAvatarWithHover from './SimpleAvatarWithHover';
import { getRankBasedAvatar } from '../utils/simpleAvatarUtils';

// Simple Leaderboard with i18n support
const SimpleLeaderboard = () => {
  const { t } = useTranslation();
  console.log('SimpleLeaderboard rendering...');
  
  let players = [];
  let dataError = null;

  try {
    const leaderboardData = getLeaderboardData();
    console.log('Leaderboard data received:', leaderboardData);
    
    if (leaderboardData && leaderboardData.players && Array.isArray(leaderboardData.players)) {
      players = leaderboardData.players;
      console.log('Players loaded:', players.length);
    } else {
      throw new Error('Invalid leaderboard data structure');
    }
  } catch (error) {
    console.error('Error in SimpleLeaderboard:', error);
    dataError = error.message;
  }

  // Simple avatar fallback without complex dependencies
  const getPlayerInitials = (name) => {
    try {
      if (!name || typeof name !== 'string') return '??';
      return name.split(' ').map(n => n[0] || '').join('').toUpperCase() || '??';
    } catch (error) {
      console.error('Error getting initials for:', name, error);
      return '??';
    }
  };

  const getRankEmoji = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈'; 
    if (rank === 3) return '🥉';
    return `${rank}.`;
  };

  if (dataError) {
    return (
      <div className="card">
        <div className="card-header bg-danger text-white">
          <h2>❌ {t('leaderboard.error')}</h2>
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
        <div className="card-header bg-warning text-dark">
          <h2>⚠️ {t('leaderboard.noData')}</h2>
        </div>
        <div className="card-body">
          <p>{t('leaderboard.noPlayerData')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header bg-primary text-white">
        <h2>🏆 {t('leaderboard.title')}</h2>
      </div>
      <div className="card-body">
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead className="table-dark">
              <tr>
                <th>{t('leaderboard.rank')}</th>
                <th>{t('leaderboard.player')}</th>
                <th>{t('leaderboard.score')}</th>
                <th>{t('leaderboard.games')}</th>
                <th>{t('leaderboard.avg')}</th>
                <th>{t('leaderboard.winRate')}</th>
              </tr>
            </thead>
            <tbody>
              {players.map((player, index) => {
                // Safe property access with defaults
                const name = player.name || 'Unknown Player';
                const score = player.cumulativeScore || 0;
                const gamesPlayed = player.gamesPlayed || 0;
                const winRate = player.winRate || 0;
                
                const avgScore = gamesPlayed > 0 ? (score / gamesPlayed).toFixed(1) : '0.0';
                
                return (
                  <tr key={`player-${index}-${name}`}>
                    <td>
                      <strong>{getRankEmoji(index + 1)}</strong>
                    </td>
                    <td>
                      <div className="d-flex align-items-center">
                        {(() => {
                          try {
                            const currentRank = index + 1; // Convert 0-based index to 1-based rank
                            const avatarSrc = getRankBasedAvatar(name, currentRank);
                            console.log('Avatar for', name, 'at rank', currentRank, ':', avatarSrc);
                            return (
                              <SimpleAvatarWithHover
                                playerName={name}
                                avatarSrc={avatarSrc}
                                size={32}
                                className="me-2"
                              />
                            );
                          } catch (error) {
                            console.error('Error rendering avatar for', name, ':', error);
                            // Fallback to simple initials
                            return (
                              <div 
                                className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-2"
                                style={{ width: '32px', height: '32px', fontSize: '12px' }}
                              >
                                {getPlayerInitials(name)}
                              </div>
                            );
                          }
                        })()}
                        <strong>{name}</strong>
                      </div>
                    </td>
                    <td>
                      <span className="badge bg-success fs-6">
                        {score}
                      </span>
                    </td>
                    <td>{gamesPlayed}</td>
                    <td>{avgScore}</td>
                    <td>
                      <span className={`badge ${winRate >= 50 ? 'bg-success' : 'bg-warning'}`}>
                        {winRate.toFixed(1)}%
                      </span>
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
                {t('leaderboard.totalPlayers')}: {players.length} | 
                {t('leaderboard.totalGames')}: {Math.floor(players.reduce((sum, p) => sum + (p.gamesPlayed || 0), 0) / 2)}
              </small>
            </div>
            <div className="col-md-6 text-end">
              <small className="text-muted">
                <strong>{t('leaderboard.avatarLegend')}:</strong> 
                <span className="ms-2">🥇😊</span>
                <span className="ms-2">🥈🥉😐</span>
                <span className="ms-2">4-6😢</span>
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleLeaderboard;