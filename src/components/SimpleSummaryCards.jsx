import React from 'react';
import { useTranslation } from 'react-i18next';
import { getLeaderboardData, getGames, getTeamStatistics } from '../utils/dataUtils';
import SimpleAvatarWithHover from './SimpleAvatarWithHover';
import { getRankBasedAvatar } from '../utils/simpleAvatarUtils';

const SimpleSummaryCards = () => {
  const { t } = useTranslation();
  console.log('SimpleSummaryCards rendering...');
  
  let players = [];
  let games = [];
  let teamStats = [];
  let dataError = null;

  try {
    const leaderboardData = getLeaderboardData();
    players = leaderboardData?.players || [];
    games = getGames() || [];
    teamStats = getTeamStatistics() || [];
  } catch (error) {
    console.error('Error loading data for summary cards:', error);
    dataError = error.message;
  }

  if (dataError) {
    return (
      <div className="alert alert-danger">
        <strong>{t('summaryCards.error')}:</strong> {dataError}
      </div>
    );
  }

  // Get the leading player (first in the sorted players array)
  const leadingPlayer = players.length > 0 ? players[0] : null;
  
  // Calculate the maximum possible score
  const totalGames = games.length;
  const maxPossibleScore = totalGames * 3; // 3 points max per game
  
  // Calculate the percentage of maximum possible score
  const scorePercentage = leadingPlayer ? Math.round((leadingPlayer.cumulativeScore / maxPossibleScore) * 100) : 0;
  
  // Get the most winning team
  const mostWinningTeam = teamStats.length > 0 ? teamStats[0] : null;
  
  // Calculate team combination stats
  const totalPlayers = players.length;
  const possibleTeamCombinations = totalPlayers * (totalPlayers - 1) / 2;
  
  // Calculate games required for all combinations
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
    Math.round((completedCombinations / possibleTeamCombinations) * 100) : 0;

  return (
    <div className="row mb-4">
      {/* Leading Player Card */}
      <div className="col-md-6 col-lg-3 mb-3">
        <div className="card h-100 border-success">
          <div className="card-header bg-success text-white text-center">
            <h5 className="mb-0">🏆 {t('summaryCards.currentLeader.title')}</h5>
          </div>
          <div className="card-body text-center">
            {leadingPlayer ? (
              <>
                <div className="mb-3">
                  <SimpleAvatarWithHover
                    playerName={leadingPlayer.name}
                    avatarSrc={getRankBasedAvatar(leadingPlayer.name, 1)}
                    size={60}
                  />
                </div>
                <h4 className="text-success">{leadingPlayer.name}</h4>
                <div className="display-6 text-success mb-2">
                  {leadingPlayer.cumulativeScore}
                </div>
                <p className="text-muted mb-1">{t('summaryCards.currentLeader.totalPoints')}</p>
                <div className="progress mb-2">
                  <div 
                    className="progress-bar bg-success" 
                    style={{ width: `${scorePercentage}%` }}
                  />
                </div>
                <small className="text-muted">
                  {scorePercentage}% {t('summaryCards.currentLeader.ofMaxScore')}<br/>
                  {leadingPlayer.gamesPlayed} {t('summaryCards.currentLeader.gamesPlayed')}<br/>
                  <strong className="text-success">{(leadingPlayer.winRate || 0).toFixed(1)}% {t('summaryCards.currentLeader.winRate')}</strong>
                </small>
              </>
            ) : (
              <p className="text-muted">{t('summaryCards.currentLeader.noGames')}</p>
            )}
          </div>
        </div>
      </div>

      {/* Game Statistics Card */}
      <div className="col-md-6 col-lg-3 mb-3">
        <div className="card h-100 border-primary">
          <div className="card-header bg-primary text-white text-center">
            <h5 className="mb-0">🎮 {t('summaryCards.gameStats.title')}</h5>
          </div>
          <div className="card-body text-center">
            <div className="display-6 text-primary mb-2">{totalGames}</div>
            <p className="text-muted mb-3">{t('summaryCards.gameStats.totalGames')}</p>
            
            <div className="row text-center">
              <div className="col-6">
                <div className="h5 text-info">{totalPlayers}</div>
                <small className="text-muted">{t('summaryCards.gameStats.players')}</small>
              </div>
              <div className="col-6">
                <div className="h5 text-warning">{Math.floor(totalGames * 1.5)}</div>
                <small className="text-muted">{t('summaryCards.gameStats.totalTeams')}</small>
              </div>
            </div>
            
            <div className="mt-3">
              <small className="text-muted">
                {t('summaryCards.gameStats.avgGamesPerPlayer', { avg: totalGames > 0 ? (totalGames / totalPlayers * 6).toFixed(1) : '0' })}
              </small>
            </div>
          </div>
        </div>
      </div>

      {/* Best Team Card */}
      <div className="col-md-6 col-lg-3 mb-3">
        <div className="card h-100 border-warning">
          <div className="card-header bg-warning text-dark text-center">
            <h5 className="mb-0">👯 {t('summaryCards.bestTeam.title')}</h5>
          </div>
          <div className="card-body text-center">
            {mostWinningTeam ? (
              <>
                <div className="mb-3 d-flex justify-content-center">
                  {mostWinningTeam.players?.map((player, idx) => (
                    <SimpleAvatarWithHover
                      key={idx}
                      playerName={player}
                      avatarSrc={getRankBasedAvatar(player, 1)}
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
                <p className="text-muted mb-1">{t('summaryCards.bestTeam.wins')}</p>
                <small className="text-muted">
                  {mostWinningTeam.gamesPlayed} {t('summaryCards.bestTeam.gamesPlayed')}<br/>
                  {(mostWinningTeam.winRate || 0).toFixed(1)}% {t('summaryCards.bestTeam.winRate')}
                </small>
              </>
            ) : (
              <p className="text-muted">{t('summaryCards.bestTeam.noTeamData')}</p>
            )}
          </div>
        </div>
      </div>

      {/* Team Combinations Card */}
      <div className="col-md-6 col-lg-3 mb-3">
        <div className="card h-100 border-info">
          <div className="card-header bg-info text-white text-center">
            <h5 className="mb-0">🔄 {t('summaryCards.combinations.title')}</h5>
          </div>
          <div className="card-body text-center">
            <div className="display-6 text-info mb-2">
              {completedCombinations}
            </div>
            <p className="text-muted mb-2">
              {t('summaryCards.combinations.ofCombinations', { total: possibleTeamCombinations })}
            </p>
            
            <div className="progress mb-3">
              <div 
                className="progress-bar bg-info" 
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
            
            <div className="h5 text-info">{completionPercentage}%</div>
            <small className="text-muted">{t('summaryCards.combinations.complete')}</small>
            
            <div className="mt-3">
              <small className="text-muted">
                {t('summaryCards.combinations.remaining', { count: possibleTeamCombinations - completedCombinations })}
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleSummaryCards;