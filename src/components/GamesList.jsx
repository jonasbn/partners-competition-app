import React, { useEffect } from 'react';
import { getGames } from '../utils/dataUtils';
import { useTranslation } from 'react-i18next';
import AvatarWithHover from './AvatarWithHover';
import Logger from '../utils/logger';

const GamesList = () => {
  const { t } = useTranslation();
  const [sortDirection, setSortDirection] = React.useState('desc'); // Default to show newest games first
  
  let games = [];
  try {
    games = getGames();
    Logger.performance('games_data_load', games.length, { 
      component: 'GamesList',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    Logger.error('Failed to load games data', error, { component: 'GamesList' });
    games = [];
  }
  
  // Sort games based on current sortDirection
  const sortedGames = [...games].sort((a, b) => {
    return sortDirection === 'asc' 
      ? a.gameId - b.gameId 
      : b.gameId - a.gameId;
  });

  // Toggle sort direction
  const toggleSort = () => {
    const newDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    Logger.userAction('games_sort_toggle', {
      fromDirection: sortDirection,
      toDirection: newDirection,
      gamesCount: games.length
    });
    setSortDirection(newDirection);
  };

  useEffect(() => {
    Logger.event('games_list_mounted', {
      gamesCount: games.length,
      sortDirection
    });
  }, [games.length, sortDirection]);

  // Function to get player's avatar image based on team score
  const getPlayerAvatarByScore = (playerName, teamScore) => {
    const playerNameLower = playerName.toLowerCase();
    let emotion;
    
    if (teamScore === 3) {
      emotion = 'happy'; // 1st place (3 points) gets happy
    } else if (teamScore === 2) {
      emotion = 'ok'; // 2nd place (2 points) gets ok
    } else {
      emotion = 'sad'; // 3rd place (1 point) gets sad
    }
    
    return `/assets/${playerNameLower}/${emotion}.png`;
  };

  return (
    <div className="card">
      <div className="card-header bg-success text-white">
        <div className="d-flex justify-content-between align-items-center">
          <h2>📅 {t('gamesList.title')}</h2>
          <button 
            className="btn btn-sm btn-light" 
            onClick={toggleSort}
            title={`${t('gamesList.sort')} ${sortDirection === 'asc' ? '⬇' : '⬆'}`}
          >
            {t('gamesList.sort')} {sortDirection === 'asc' ? '⬇' : '⬆'}
          </button>
        </div>
      </div>
      <div className="card-body">
        {sortedGames.map((game) => (
          <div key={game.gameId} className="card mb-3">
            <div className="card-header">
              <h5>{t('gamesList.game', { number: game.gameId, date: game.gameDate })}</h5>
            </div>
            <div className="card-body">
              <h6>{t('gamesList.teamsScores')}</h6>
              <ul className="list-group">
                {[...game.teams]
                  .sort((a, b) => b.score - a.score) // Sort by score in descending order
                  .map((team, idx) => (
                  <li key={idx} className="list-group-item d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center">
                      <strong className="me-2">{t('gamesList.team')}</strong>
                      {team.players.map((player, playerIdx) => (
                        <div key={playerIdx} className="d-flex align-items-center me-2">
                          <AvatarWithHover
                            playerName={player}
                            avatarSrc={getPlayerAvatarByScore(player, team.score)}
                            size={30}
                            borderColor="var(--bs-success, #198754)"
                            style={{ marginRight: '5px' }}
                          />
                          {player}{playerIdx < team.players.length - 1 ? " &" : ""}
                        </div>
                      ))}
                    </div>
                    <span className={`badge bg-${team.score === 3 ? 'primary' : team.score === 2 ? 'success' : 'warning'} rounded-pill`}>
                      {team.score === 3 ? '🥇 ' : team.score === 2 ? '🥈 ' : '🥉 '}
                      {team.score} {t(`gamesList.points.${team.score === 1 ? 'one' : 'other'}`)}
                      {team.score === 3 ? ` (${t('gamesList.points.first')})` : 
                       team.score === 2 ? ` (${t('gamesList.points.second')})` : 
                       ` (${t('gamesList.points.third')})`}
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
