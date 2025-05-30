import React from 'react';
import { getGames } from '../utils/dataUtils';
import { getAvatarColor, getInitials } from '../utils/avatarUtils';

const GamesList = () => {
  const games = getGames();

  // Style for the avatar circle
  const avatarStyle = (name) => ({
    width: '30px',
    height: '30px',
    borderRadius: '50%',
    backgroundColor: getAvatarColor(name),
    color: 'white',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    marginRight: '5px',
    fontSize: '0.8rem'
  });

  return (
    <div className="card">
      <div className="card-header bg-success text-white">
        <h2>📅 Games History</h2>
      </div>
      <div className="card-body">
        {games.map((game) => (
          <div key={game.gameId} className="card mb-3">
            <div className="card-header">
              <h5>Game #{game.gameId} - {game.gameDate}</h5>
            </div>
            <div className="card-body">
              <h6>Teams and Scores:</h6>
              <ul className="list-group">
                {[...game.teams]
                  .sort((a, b) => b.score - a.score) // Sort by score in descending order
                  .map((team, idx) => (
                  <li key={idx} className="list-group-item d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center">
                      <strong className="me-2">Team:</strong>
                      {team.players.map((player, playerIdx) => (
                        <div key={playerIdx} className="d-flex align-items-center me-2">
                          <div style={avatarStyle(player)} className="avatar">
                            {getInitials(player)}
                          </div>
                          {player}{playerIdx < team.players.length - 1 ? " &" : ""}
                        </div>
                      ))}
                    </div>
                    <span className={`badge bg-${team.score === 3 ? 'primary' : team.score === 2 ? 'success' : 'warning'} rounded-pill`}>
                      {team.score === 3 ? '🥇 ' : team.score === 2 ? '🥈 ' : '🥉 '}
                      {team.score} {team.score === 1 ? 'point' : 'points'}
                      {team.score === 3 ? ' (1st place)' : team.score === 2 ? ' (2nd place)' : ' (3rd place)'}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GamesList;
