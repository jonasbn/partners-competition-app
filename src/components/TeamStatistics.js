import React from 'react';
import { getTeamStatistics } from '../utils/dataUtils';
import { getAvatarColor, getInitials } from '../utils/avatarUtils';
import { useTranslation } from 'react-i18next';

const TeamStatistics = () => {
  const { t } = useTranslation();
  const teamStats = getTeamStatistics();
  
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
      <div className="card-header bg-primary text-white">
        <h2>🤝 {t('teamStats.title')}</h2>
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
                          <div style={avatarStyle(player)} className="avatar">
                            {getInitials(player)}
                          </div>
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
