import React from 'react';
import { getGames } from '../utils/dataUtils';

// Simple GamesList without i18n or external dependencies
const SimpleGamesList = () => {
  console.log('SimpleGamesList rendering...');
  
  let games = [];
  let dataError = null;

  try {
    const gamesData = getGames();
    console.log('Games data received:', gamesData);
    
    if (gamesData && Array.isArray(gamesData)) {
      games = gamesData;
      console.log('Games loaded:', games.length);
    } else {
      throw new Error('Invalid games data structure');
    }
  } catch (error) {
    console.error('Error in SimpleGamesList:', error);
    dataError = error.message;
  }

  const getResultBadge = (score1, score2) => {
    if (score1 > score2) return { class: 'bg-success', text: 'Win' };
    if (score1 < score2) return { class: 'bg-danger', text: 'Loss' };
    return { class: 'bg-secondary', text: 'Tie' };
  };

  const formatDate = (dateString) => {
    try {
      if (!dateString) return 'Unknown Date';
      return new Date(dateString).toLocaleDateString();
    } catch {
      return dateString || 'Invalid Date';
    }
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

            <div className="table-responsive">
              <table className="table table-sm table-hover">
                <thead className="table-dark">
                  <tr>
                    <th>Game</th>
                    <th>Date</th>
                    <th>Team 1</th>
                    <th>Score</th>
                    <th>Team 2</th>
                    <th>Score</th>
                    <th>Result</th>
                  </tr>
                </thead>
                <tbody>
                  {games.slice().reverse().map((game) => {
                    const team1 = game.teams[0];
                    const team2 = game.teams[1];
                    const result = getResultBadge(team1.score, team2.score);

                    return (
                      <tr key={game.gameId}>
                        <td>
                          <strong>#{game.gameId}</strong>
                        </td>
                        <td>
                          <small>{formatDate(game.gameDate)}</small>
                        </td>
                        <td>
                          <small>
                            {team1.players.join(' & ')}
                          </small>
                        </td>
                        <td>
                          <span className={`badge ${team1.score > team2.score ? 'bg-success' : 'bg-secondary'}`}>
                            {team1.score}
                          </span>
                        </td>
                        <td>
                          <small>
                            {team2.players.join(' & ')}
                          </small>
                        </td>
                        <td>
                          <span className={`badge ${team2.score > team1.score ? 'bg-success' : 'bg-secondary'}`}>
                            {team2.score}
                          </span>
                        </td>
                        <td>
                          <span className={`badge ${result.class}`}>
                            {team1.score > team2.score ? 'Team 1' : team2.score > team1.score ? 'Team 2' : 'Tie'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
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