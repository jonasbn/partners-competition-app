import React from 'react';
import { getLeaderboardData } from '../utils/dataUtils';
import { useTranslation } from 'react-i18next';
import AvatarWithHover from './AvatarWithHover';

const Leaderboard = () => {
  const { t } = useTranslation();
  const { players } = getLeaderboardData();

  // Function to get player's avatar image based on ranking
  const getPlayerAvatarByRank = (playerName, rank) => {
    const playerNameLower = playerName.toLowerCase();
    let emotion;
    
    if (rank === 1) {
      emotion = 'happy'; // 1st place gets happy
    } else if (rank === 2 || rank === 3) {
      emotion = 'ok'; // 2nd and 3rd place get ok
    } else {
      emotion = 'sad'; // 4th, 5th, 6th place get sad
    }
    
    return `/assets/${playerNameLower}/${emotion}.png`;
  };

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
                      <AvatarWithHover
                        playerName={player.name}
                        avatarSrc={getPlayerAvatarByRank(player.name, index + 1)}
                        size={40}
                        borderColor="var(--bs-primary, #0d6efd)"
                        style={{ marginRight: '10px' }}
                      />
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
