import React from 'react';
import { getTeamStatistics } from '../utils/dataUtils';
import { useTranslation } from 'react-i18next';
import AvatarWithHover from './AvatarWithHover';

const TeamStatistics = () => {
  const { t } = useTranslation();
  const teamStats = getTeamStatistics();
  
  // Function to get player's avatar image based on team ranking
  const getPlayerAvatarByTeamRank = (playerName, teamRank) => {
    const playerNameLower = playerName.toLowerCase();
    let emotion;
    
    if (teamRank === 1) {
      emotion = 'happy'; // 1st place team gets happy
    } else {
      emotion = 'ok'; // All other teams get ok
    }
    
    return `/assets/${playerNameLower}/${emotion}.png`;
  };

  return (
    <div className="card">
      <div className="card-header bg-primary text-white">
        <h2>👯 {t('teamStats.title')}</h2>
      </div>
      <div className="card-body">
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead className="table-dark">
              <tr>
                <th>{t('teamStats.rank')}</th>
                <th>{t('teamStats.team')}</th>
                <th>{t('teamStats.gamesPlayed')}</th>
                <th>{t('teamStats.wins')}</th>
                <th>{t('teamStats.seconds')}</th>
                <th>{t('teamStats.thirds')}</th>
                <th>{t('teamStats.winRate')}</th>
                <th>{t('teamStats.totalPoints')}</th>
              </tr>
            </thead>
            <tbody>
              {teamStats.map((team, index) => (
                <tr key={index} className={index === 0 ? 'table-success' : ''}>
                  <td><strong>{index + 1}</strong></td>
                  <td>
                    <div className="d-flex align-items-center">
                      {team.players.map((player, playerIdx) => (
                        <div key={playerIdx} className="d-flex align-items-center me-2">
                          <AvatarWithHover
                            playerName={player}
                            avatarSrc={getPlayerAvatarByTeamRank(player, index + 1)}
                            size={30}
                            borderColor="var(--bs-primary, #0d6efd)"
                            style={{ marginRight: '5px' }}
                          />
                          <span className="ms-1">{player}</span>
                          {playerIdx < team.players.length - 1 && <span className="ms-1">&</span>}
                        </div>
                      ))}
                    </div>
                  </td>
                  <td>{team.gamesPlayed}</td>
                  <td>{team.wins} ({Math.round(team.wins / team.gamesPlayed * 100) || 0}%)</td>
                  <td>{team.seconds}</td>
                  <td>{team.thirds}</td>
                  <td>
                    <div className="progress" style={{ height: '20px' }}>
                      <div 
                        className="progress-bar bg-success" 
                        role="progressbar" 
                        style={{ width: `${team.winRate}%` }} 
                        aria-valuenow={team.winRate} 
                        aria-valuemin="0" 
                        aria-valuemax="100"
                      >
                        {Math.round(team.winRate)}%
                      </div>
                    </div>
                  </td>
                  <td>{team.totalPoints}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {teamStats.length > 0 && (
          <div className="alert alert-success mt-3">
            <h5>🏆 {t('teamStats.bestTeam', { team: teamStats[0].players.join(' & ') })}</h5>
            <p>
              {t('teamStats.bestTeamStats', { 
                wins: teamStats[0].wins,
                games: teamStats[0].gamesPlayed,
                rate: Math.round(teamStats[0].winRate)
              })}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamStatistics;
