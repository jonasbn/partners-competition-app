import React from 'react';
import { getGames } from '../utils/dataUtils';

const SimpleGamesList = () => {
  let games = [];
  let dataError = null;

  try {
    const gamesData = getGames();
    if (gamesData && Array.isArray(gamesData)) {
      games = gamesData;
    } else {
      throw new Error('Invalid games data structure');
    }
  } catch (error) {
    console.error('Error in SimpleGamesList:', error);
    dataError = error.message;
  }

  const formatDate = (dateString) => {
    try {
      if (!dateString) return 'Unknown Date';
      return new Date(dateString).toLocaleDateString();
    } catch {
      return dateString || 'Invalid Date';
    }
  };

  const getPlaceInfo = (score) => {
    if (score === 3) return { place: '1st', emoji: '🥇', class: 'success' };
    if (score === 2) return { place: '2nd', emoji: '🥈', class: 'warning' };
    if (score === 1) return { place: '3rd', emoji: '🥉', class: 'secondary' };
    return { place: '?', emoji: '❓', class: 'secondary' };
  };

  if (dataError) {
    return (
      <div className="card">
        <div className="card-header bg-danger text-white">
          <h2>❌ Games History Error</h2>
        </div>
        <div className="card-body">
          <div className="alert alert-danger">
            <strong>Error:</strong> {dataError}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header bg-success text-white">
        <h2>🎮 Games History</h2>
      </div>
      <div className="card-body">
        {games.length === 0 ? (
          <div className="alert alert-info">
            <h4>No games recorded yet</h4>
            <p>Start playing some games to see the history here!</p>
          </div>
        ) : (
          <>
            <div className="mb-3">
              <span className="badge bg-info me-2">
                Total Games: {games.length}
              </span>
              <span className="badge bg-secondary">
                Latest: {formatDate(games[games.length - 1]?.gameDate)}
              </span>
            </div>

            <div className="row">
              {games.slice().reverse().map((game) => {
                const sortedTeams = [...game.teams].sort((a, b) => b.score - a.score);

                return (
                  <div key={game.gameId} className="col-lg-6 mb-4">
                    <div className="card h-100 border-primary">
                      <div className="card-header bg-primary text-white">
                        <div className="d-flex justify-content-between align-items-center">
                          <h6 className="mb-0">🎮 Game #{game.gameId}</h6>
                          <small>{formatDate(game.gameDate)}</small>
                        </div>
                      </div>
                      <div className="card-body">
                        <div className="row">
                          {sortedTeams.map((team, index) => {
                            const placeInfo = getPlaceInfo(team.score);
                            return (
                              <div key={index} className="col-12 mb-3">
                                <div className={`card border-${placeInfo.class}`}>
                                  <div className={`card-header bg-${placeInfo.class} text-white py-2`}>
                                    <div className="d-flex justify-content-between align-items-center">
                                      <small>
                                        <strong>{placeInfo.emoji} {placeInfo.place} Place</strong>
                                      </small>
                                      <span className="badge bg-light text-dark">
                                        {team.score} points
                                      </span>
                                    </div>
                                  </div>
                                  <div className="card-body py-2">
                                    <div className="text-center">
                                      <strong>{team.players.join(' & ')}</strong>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        
                        <div className="mt-2 pt-2 border-top">
                          <small className="text-muted">
                            <strong>Winner:</strong> {sortedTeams[0].players.join(' & ')} 
                            <span className="badge bg-success ms-2">{sortedTeams[0].score} pts</span>
                          </small>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {games.length > 10 && (
              <div className="mt-3">
                <small className="text-muted">
                  Showing all {games.length} games (most recent first)
                </small>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SimpleGamesList;
