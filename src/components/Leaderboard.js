import React from 'react';
import { getLeaderboardData } from '../utils/dataUtils';
import { getAvatarColor, getInitials } from '../utils/avatarUtils';
import { useTranslation } from 'react-i18next';

const Leaderboard = () => {
  const { t } = useTranslation();
  const { players } = getLeaderboardData();

  // Style for the avatar circle
  const avatarStyle = (name) => ({
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: getAvatarColor(name),
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    marginRight: '10px'
  });

  return (
    <div className="card mb-4">
      <div className="card-header bg-primary text-white">
        <h2>🏆 {t('leaderboard.title')} 🏆</h2>
      </div>
      <div className="card-body">
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead className="table-dark">
              <tr>
                <th>{t('leaderboard.rank')}</th>
                <th>{t('leaderboard.player')}</th>
                <th>{t('leaderboard.points')}</th>
              </tr>
            </thead>
            <tbody>
              {players.map((player, index) => (
                <tr key={player.id} className={
                  index === 0 ? 'table-warning' : 
                  index === 1 ? 'table-light' : 
                  index === 2 ? 'table-secondary' : ''
                }>
                  <td>
                    {index === 0 ? '🥇 1' : 
                     index === 1 ? '🥈 2' : 
                     index === 2 ? '🥉 3' : 
                     index + 1}
                  </td>
                  <td>
                    <div className="d-flex align-items-center">
                      <div style={avatarStyle(player.name)} className="avatar">
                        {getInitials(player.name)}
                      </div>
                      {player.name}
                    </div>
                  </td>
                  <td>{player.cumulativeScore}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
