import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { processTournamentData, getTournamentTeamStatistics } from '../utils/tournamentUtils';
import SimpleAvatarWithHover from './SimpleAvatarWithHover';
import { getRankBasedAvatar } from '../utils/simpleAvatarUtils';

const TournamentSummaryCards = ({ gameData }) => {
  const { t } = useTranslation();

  let players = [];
  let games = [];
  let teamStats = [];
  let dataError = null;

  try {
    const processed = processTournamentData(gameData);
    players = processed.players || [];
    games = processed.games || [];
    teamStats = getTournamentTeamStatistics(gameData) || [];
  } catch (error) {
    console.error('Error loading data for tournament summary cards:', error);
    dataError = error.message;
  }

  if (dataError) {
    return (
      <div className="alert alert-danger">
        <strong>{t('tournament.summaryCards.error')}:</strong> {dataError}
      </div>
    );
  }

  const totalGames = games.length;
  const totalPlayers = players.length;
  // A "leader" only means something once at least one game has been played -
  // processTournamentData always returns all 8 players (tied at 0), so
  // players[0] would otherwise be an arbitrary array-order pick, not a leader.
  const leadingPlayer = totalGames > 0 && players.length > 0 ? players[0] : null;

  // Max possible score is based on the leading player's own games played
  // (not totalGames), since tournament players don't all play every game.
  const maxPossibleScore = leadingPlayer ? leadingPlayer.gamesPlayed * 2 : 0;
  const scorePercentage = leadingPlayer && maxPossibleScore > 0
    ? Math.round((leadingPlayer.cumulativeScore / maxPossibleScore) * 100)
    : 0;

  const mostWinningTeam = teamStats.length > 0 ? teamStats[0] : null;

  const possibleTeamCombinations = totalPlayers * (totalPlayers - 1) / 2;

  const formedTeams = new Set();
  games.forEach(game => {
    if (game.teams) {
      game.teams.forEach(team => {
        if (team.players) {
          const teamKey = [...team.players].sort().join('-');
          formedTeams.add(teamKey);
        }
      });
    }
  });

  const completedCombinations = formedTeams.size;
  const completionPercentage = possibleTeamCombinations > 0 ?
    Math.min(100, Math.max(0, Math.round((completedCombinations / possibleTeamCombinations) * 100))) : 0;

  return (
    <div className="row mb-4">
      {/* Leading Player Card */}
      <div className="col-md-6 col-lg-3 mb-3">
        <div className="card h-100 border-success">
          <div className="card-header bg-success text-white text-center">
            <h5 className="mb-0">🏆 {t('tournament.summaryCards.currentLeader.title')}</h5>
          </div>
          <div className="card-body text-center">
            {leadingPlayer ? (
              <>
                <div className="mb-3">
                  <SimpleAvatarWithHover
                    playerName={leadingPlayer.name}
                    avatarSrc={getRankBasedAvatar(leadingPlayer.name, 1, leadingPlayer.gamesPlayed)}
                    size={60}
                  />
                </div>
                <h4 className="text-success">{leadingPlayer.name}</h4>
                <div className="display-6 text-success mb-2">
                  {leadingPlayer.cumulativeScore}
                </div>
                <p className="text-muted mb-1">{t('tournament.summaryCards.currentLeader.totalPoints')}</p>
                <div className="progress mb-2">
                  <div
                    className="progress-bar bg-success"
                    role="progressbar"
                    style={{ width: `${scorePercentage}%` }}
                    aria-valuenow={scorePercentage}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  />
                </div>
                <small className="text-muted">
                  {scorePercentage}% {t('tournament.summaryCards.currentLeader.ofMaxScore')}<br/>
                  {leadingPlayer.gamesPlayed} {t('tournament.summaryCards.currentLeader.gamesPlayed')}<br/>
                  <strong className="text-success">{(leadingPlayer.winRate || 0).toFixed(1)}% {t('tournament.summaryCards.currentLeader.winRate')}</strong>
                </small>
              </>
            ) : (
              <p className="text-muted">{t('tournament.summaryCards.currentLeader.noGames')}</p>
            )}
          </div>
        </div>
      </div>

      {/* Game Statistics Card */}
      <div className="col-md-6 col-lg-3 mb-3">
        <div className="card h-100 border-primary">
          <div className="card-header bg-primary text-white text-center">
            <h5 className="mb-0">🎮 {t('tournament.summaryCards.gameStats.title')}</h5>
          </div>
          <div className="card-body text-center">
            <div className="display-6 text-primary mb-2">{totalGames}</div>
            <p className="text-muted mb-3">{t('tournament.summaryCards.gameStats.totalGames')}</p>

            <div className="row text-center">
              <div className="col-6">
                <div className="h5 text-info">{totalPlayers}</div>
                <small className="text-muted">{t('tournament.summaryCards.gameStats.players')}</small>
              </div>
              <div className="col-6">
                <div className="h5 text-warning">{totalGames * 2}</div>
                <small className="text-muted">{t('tournament.summaryCards.gameStats.totalTeams')}</small>
              </div>
            </div>

            <div className="mt-3">
              <small className="text-muted">
                {t('tournament.summaryCards.gameStats.avgGamesPerPlayer', {
                  avg: totalGames > 0 && totalPlayers > 0 ? (totalGames * 4 / totalPlayers).toFixed(1) : '0'
                })}
              </small>
            </div>
          </div>
        </div>
      </div>

      {/* Best Team Card */}
      <div className="col-md-6 col-lg-3 mb-3">
        <div className="card h-100 border-warning">
          <div className="card-header bg-warning text-dark text-center">
            <h5 className="mb-0">👯 {t('tournament.summaryCards.bestTeam.title')}</h5>
          </div>
          <div className="card-body text-center">
            {mostWinningTeam ? (
              <>
                <div className="mb-3 d-flex justify-content-center">
                  {mostWinningTeam.players?.map((player, idx) => (
                    <SimpleAvatarWithHover
                      key={idx}
                      playerName={player}
                      avatarSrc={getRankBasedAvatar(player, 1, mostWinningTeam.gamesPlayed)}
                      size={30}
                      className={idx > 0 ? 'ms-1' : ''}
                    />
                  ))}
                </div>
                <h6 className="text-warning">
                  {mostWinningTeam.players?.join(' & ')}
                </h6>
                <div className="h4 text-warning mb-2">
                  {mostWinningTeam.wins}
                </div>
                <p className="text-muted mb-1">{t('tournament.summaryCards.bestTeam.wins')}</p>
                <small className="text-muted">
                  {mostWinningTeam.gamesPlayed} {t('tournament.summaryCards.bestTeam.gamesPlayed')}<br/>
                  {(mostWinningTeam.winRate || 0).toFixed(1)}% {t('tournament.summaryCards.bestTeam.winRate')}
                </small>
              </>
            ) : (
              <p className="text-muted">{t('tournament.summaryCards.bestTeam.noTeamData')}</p>
            )}
          </div>
        </div>
      </div>

      {/* Team Combinations Card */}
      <div className="col-md-6 col-lg-3 mb-3">
        <div className="card h-100 border-info">
          <div className="card-header bg-info text-white text-center">
            <h5 className="mb-0">🔄 {t('tournament.summaryCards.combinations.title')}</h5>
          </div>
          <div className="card-body text-center">
            <div className="display-6 text-info mb-2">
              {completedCombinations}
            </div>
            <p className="text-muted mb-2">
              {t('tournament.summaryCards.combinations.ofCombinations', { total: possibleTeamCombinations })}
            </p>

            <div className="progress mb-3">
              <div
                className="progress-bar bg-info"
                role="progressbar"
                style={{ width: `${completionPercentage}%` }}
                aria-valuenow={completionPercentage}
                aria-valuemin={0}
                aria-valuemax={100}
              />
            </div>

            <div className="h5 text-info">{completionPercentage}%</div>
            <small className="text-muted">{t('tournament.summaryCards.combinations.complete')}</small>

            <div className="mt-3">
              <small className="text-muted">
                {t('tournament.summaryCards.combinations.remaining', { count: Math.max(0, possibleTeamCombinations - completedCombinations) })}
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

TournamentSummaryCards.propTypes = {
  gameData: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default TournamentSummaryCards;
