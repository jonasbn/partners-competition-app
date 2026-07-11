import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { getTournamentGames } from '../utils/tournamentUtils';

const TournamentGamesList = ({ gameData }) => {
  const { t, i18n } = useTranslation();
  let games = [];
  let dataError = null;

  try {
    const gamesData = getTournamentGames(gameData);
    if (gamesData && Array.isArray(gamesData)) {
      games = gamesData;
    } else {
      throw new Error('Invalid games data structure');
    }
  } catch (error) {
    console.error('Error in TournamentGamesList:', error);
    dataError = error.message;
  }

  const formatDate = (dateString) => {
    if (!dateString) return t('tournament.gamesList.unknownDate');
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString(i18n.language, {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    } catch {
      return t('tournament.gamesList.invalidDate');
    }
  };

  // Only two outcomes per game: score 2 is the win, score 1 is the loss.
  const getPlaceInfo = (score) => {
    if (score === 2) return { place: t('tournament.gamesList.points.win'), emoji: '🥇', class: 'success' };
    if (score === 1) return { place: t('tournament.gamesList.points.loss'), emoji: '🥈', class: 'secondary' };
    return { place: '?', emoji: '❓', class: 'secondary' };
  };

  if (dataError) {
    return (
      <div className="card">
        <div className="card-header bg-danger text-white">
          <h2>❌ {t('tournament.gamesList.title')}</h2>
        </div>
        <div className="card-body">
          <div className="alert alert-danger">
            <strong>{t('tournament.gamesList.errorLoading')}:</strong> {dataError}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header bg-success text-white">
        <h2>🎮 {t('tournament.gamesList.title')}</h2>
      </div>
      <div className="card-body">
        {games.length === 0 ? (
          <div className="alert alert-info">
            <h4>{t('tournament.gamesList.noGames')}</h4>
            <p>{t('tournament.gamesList.startPlaying')}</p>
          </div>
        ) : (
          <>
            <div className="mb-3">
              <span className="badge bg-info me-2">
                {t('tournament.gamesList.totalGames')}: {games.length}
              </span>
              <span className="badge bg-secondary">
                {t('tournament.gamesList.latest')}: {formatDate(games[games.length - 1]?.gameDate)}
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
                          <h6 className="mb-0">🎮 {t('tournament.gamesList.gameNumber', { number: game.gameId })}</h6>
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
                                        <strong>{placeInfo.emoji} {placeInfo.place}</strong>
                                      </small>
                                      <span className="badge bg-light text-dark">
                                        {team.score} {t('tournament.gamesList.points.other')}
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
                            <strong>{t('tournament.gamesList.winner')}:</strong> <span>{sortedTeams[0].players.join(' & ')}</span>
                            <span className="badge bg-success ms-2">{sortedTeams[0].score} {t('tournament.gamesList.points.other')}</span>
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
                  {t('tournament.gamesList.showing', { count: games.length })}
                </small>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

TournamentGamesList.propTypes = {
  gameData: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default TournamentGamesList;
