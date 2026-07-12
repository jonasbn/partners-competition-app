import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { getTournamentTeamStatistics } from '../utils/tournamentUtils';
import SimpleAvatarWithHover from './SimpleAvatarWithHover';
import { getRankBasedAvatar } from '../utils/simpleAvatarUtils';

const TournamentTeamStatistics = ({ gameData }) => {
  const { t } = useTranslation();

  let teamStats = [];
  let dataError = null;

  try {
    teamStats = getTournamentTeamStatistics(gameData) || [];
  } catch (error) {
    console.error('Error loading tournament team statistics:', error);
    dataError = error.message;
  }

  if (dataError) {
    return (
      <div className="card">
        <div className="card-header bg-danger text-white">
          <h2>❌ {t('tournament.teamStats.title')}</h2>
        </div>
        <div className="card-body">
          <div className="alert alert-danger">
            <strong>{t('common.error')}:</strong> {dataError}
          </div>
        </div>
      </div>
    );
  }

  if (!teamStats || teamStats.length === 0) {
    return (
      <div className="card">
        <div className="card-header bg-info text-white">
          <h2>👯 {t('tournament.teamStats.title')}</h2>
        </div>
        <div className="card-body">
          <div className="alert alert-info">
            <h4>{t('tournament.teamStats.noData')}</h4>
            <p>{t('tournament.teamStats.playGames')}</p>
          </div>
        </div>
      </div>
    );
  }

  const getTeamRankingClass = (rank) => {
    if (rank === 1) return 'table-success';
    if (rank <= 3) return 'table-warning';
    return '';
  };

  const getRankIcon = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `${rank}.`;
  };

  return (
    <div className="card mb-4">
      <div className="card-header bg-primary text-white">
        <h2>👯 {t('tournament.teamStats.title')}</h2>
      </div>
      <div className="card-body">
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <caption className="visually-hidden">{t('tournament.teamStats.title')}</caption>
            <thead className="table-dark">
              <tr>
                <th>{t('tournament.teamStats.rank')}</th>
                <th>{t('tournament.teamStats.teamName')}</th>
                <th>{t('tournament.teamStats.gamesPlayed')}</th>
                <th>{t('tournament.teamStats.wins')}</th>
                <th>{t('tournament.teamStats.losses')}</th>
                <th>{t('tournament.teamStats.winRate')}</th>
                <th>{t('tournament.teamStats.totalPoints')}</th>
              </tr>
            </thead>
            <tbody>
              {teamStats.map((team, index) => {
                const rank = index + 1;
                const players = team.players || [];
                const gamesPlayed = team.gamesPlayed || 0;
                const wins = team.wins || 0;
                const losses = team.losses || 0;
                const winRate = team.winRate || 0;
                const totalPoints = team.totalPoints || 0;

                return (
                  <tr key={`${players.join('-')}-${index}`} className={getTeamRankingClass(rank)}>
                    <td>
                      <strong>{getRankIcon(rank)}</strong>
                    </td>
                    <td>
                      <div className="d-flex align-items-center">
                        {players.map((player, playerIdx) => {
                          try {
                            const avatarRank = rank <= 3 ? 1 : rank <= 9 ? 2 : 4;
                            return (
                              <div key={`${player}-${playerIdx}`} className="d-flex align-items-center me-2">
                                <SimpleAvatarWithHover
                                  playerName={player}
                                  avatarSrc={getRankBasedAvatar(player, avatarRank, gamesPlayed)}
                                  size={24}
                                  className="me-1"
                                />
                                <span className="small">{player}</span>
                                {playerIdx < players.length - 1 && <span className="mx-1">&</span>}
                              </div>
                            );
                          } catch (error) {
                            console.error('Error rendering team player avatar:', error);
                            return (
                              <span key={`${player}-${playerIdx}`} className="me-2">
                                {player}
                                {playerIdx < players.length - 1 && ' & '}
                              </span>
                            );
                          }
                        })}
                      </div>
                    </td>
                    <td>
                      <span className="badge bg-secondary">{gamesPlayed}</span>
                    </td>
                    <td>
                      <span className="badge bg-success">{wins}</span>
                    </td>
                    <td>
                      <span className="badge bg-danger">{losses}</span>
                    </td>
                    <td>
                      <span className={`badge ${winRate >= 50 ? 'bg-success' : 'bg-secondary'}`}>
                        {winRate.toFixed(1)}%
                      </span>
                    </td>
                    <td>
                      <strong className="text-primary">{totalPoints}</strong>
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
                <strong>{t('tournament.teamStats.totalTeams')}:</strong> {teamStats.length} |
                <strong>{t('tournament.teamStats.totalGamesTracked')}:</strong> {teamStats.reduce((sum, team) => sum + (team.gamesPlayed || 0), 0)}
              </small>
            </div>
            <div className="col-md-6 text-end">
              <small className="text-muted">
                <strong>{t('tournament.teamStats.ranking')}:</strong> {t('tournament.teamStats.rankingMethod')}
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

TournamentTeamStatistics.propTypes = {
  gameData: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default TournamentTeamStatistics;
