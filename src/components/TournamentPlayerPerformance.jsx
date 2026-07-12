import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { getTournamentLeaderboardData } from '../utils/tournamentUtils';
import SimpleAvatarWithHover from './SimpleAvatarWithHover';
import { getRankBasedAvatar } from '../utils/simpleAvatarUtils';

const TournamentPlayerPerformance = ({ gameData }) => {
  const { t } = useTranslation();

  let players = [];
  let dataError = null;

  try {
    const leaderboardData = getTournamentLeaderboardData(gameData);
    players = leaderboardData?.players || [];
  } catch (error) {
    console.error('Error loading tournament player performance data:', error);
    dataError = error.message;
  }

  if (dataError) {
    return (
      <div className="card">
        <div className="card-header bg-danger text-white">
          <h2>❌ {t('tournament.playerPerformance.error')}</h2>
        </div>
        <div className="card-body">
          <div className="alert alert-danger">
            <strong>Error:</strong> {dataError}
          </div>
        </div>
      </div>
    );
  }

  if (!players || players.length === 0) {
    return (
      <div className="card">
        <div className="card-header bg-info text-white">
          <h2>📈 {t('tournament.playerPerformance.title')}</h2>
        </div>
        <div className="card-body">
          <div className="alert alert-info">
            <h4>{t('tournament.playerPerformance.noData')}</h4>
            <p>{t('tournament.playerPerformance.playGames')}</p>
          </div>
        </div>
      </div>
    );
  }

  const sortedPlayers = [...players].sort((a, b) => b.cumulativeScore - a.cumulativeScore);

  const getPerformanceLevel = (rank, totalPlayers) => {
    if (rank === 1) return { level: t('tournament.playerPerformance.performanceLevels.excellent'), class: 'success', icon: '🔥' };
    if (rank <= Math.ceil(totalPlayers * 0.33)) return { level: t('tournament.playerPerformance.performanceLevels.good'), class: 'warning', icon: '👍' };
    if (rank <= Math.ceil(totalPlayers * 0.67)) return { level: t('tournament.playerPerformance.performanceLevels.average'), class: 'info', icon: '👌' };
    return { level: t('tournament.playerPerformance.performanceLevels.needsWork'), class: 'secondary', icon: '💪' };
  };

  const getProgressBarWidth = (score, maxScore) => {
    return maxScore > 0 ? Math.min((score / maxScore) * 100, 100) : 0;
  };

  const maxScore = sortedPlayers.length > 0 ? sortedPlayers[0].cumulativeScore : 1;

  return (
    <div className="card mb-4">
      <div className="card-header bg-primary text-white">
        <h2>📈 {t('tournament.playerPerformance.title')}</h2>
      </div>
      <div className="card-body">
        <div className="row">
          {sortedPlayers.map((player, index) => {
            const rank = index + 1;
            const name = player.name || t('common.unknownPlayer');
            const score = player.cumulativeScore || 0;
            const gamesPlayed = player.gamesPlayed || 0;
            const winRate = player.winRate || 0;
            const avgScore = player.avgScore ? player.avgScore.toFixed(1) : '0.0';

            const performance = getPerformanceLevel(rank, sortedPlayers.length);
            const progressWidth = getProgressBarWidth(score, maxScore);

            return (
              <div key={`${name}-${index}`} className="col-md-6 col-lg-4 mb-4">
                <div className={`card border-${performance.class} h-100`}>
                  <div className={`card-header bg-${performance.class} text-white`}>
                    <div className="d-flex align-items-center justify-content-between">
                      <h6 className="mb-0">#{rank} {name}</h6>
                      <span>{performance.icon}</span>
                    </div>
                  </div>
                  <div className="card-body text-center">
                    <div className="mb-3">
                      <SimpleAvatarWithHover
                        playerName={name}
                        avatarSrc={getRankBasedAvatar(name, rank, gamesPlayed)}
                        size={50}
                      />
                    </div>

                    <div className="mb-3">
                      <div className="display-6 text-primary">{score}</div>
                      <small className="text-muted">{t('tournament.playerPerformance.totalPoints')}</small>
                    </div>

                    <div className="progress mb-3">
                      <div
                        className={`progress-bar bg-${performance.class}`}
                        role="progressbar"
                        style={{ width: `${progressWidth}%` }}
                        aria-valuenow={progressWidth}
                        aria-valuemin={0}
                        aria-valuemax={100}
                      />
                    </div>

                    <div className="row text-center mb-3">
                      <div className="col-4">
                        <div className="h6 text-info">{gamesPlayed}</div>
                        <small className="text-muted">{t('tournament.playerPerformance.games')}</small>
                      </div>
                      <div className="col-4">
                        <div className="h6 text-success">{avgScore}</div>
                        <small className="text-muted">{t('tournament.playerPerformance.avgPerGame')}</small>
                      </div>
                      <div className="col-4">
                        <div className={`h6 ${winRate >= 60 ? 'text-success' : winRate >= 40 ? 'text-warning' : 'text-danger'}`}>
                          {winRate.toFixed(1)}%
                        </div>
                        <small className="text-muted">{t('tournament.playerPerformance.winRate')}</small>
                      </div>
                    </div>

                    <div className="mb-3">
                      <div className="progress" style={{height: '6px'}}>
                        <div
                          className={`progress-bar ${winRate >= 60 ? 'bg-success' : winRate >= 40 ? 'bg-warning' : 'bg-danger'}`}
                          role="progressbar"
                          style={{ width: `${winRate}%` }}
                          aria-valuenow={winRate}
                          aria-valuemin={0}
                          aria-valuemax={100}
                        />
                      </div>
                      <small className="text-muted">
                        {winRate >= 60 ? t('tournament.playerPerformance.winRateMessages.excellent') :
                         winRate >= 40 ? t('tournament.playerPerformance.winRateMessages.good') :
                         winRate >= 20 ? t('tournament.playerPerformance.winRateMessages.improvement') :
                         t('tournament.playerPerformance.winRateMessages.practice')}
                      </small>
                    </div>

                    <div className={`badge bg-${performance.class} fs-6`}>
                      {performance.level}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-4">
          <div className="alert alert-light">
            <h5>{t('tournament.playerPerformance.insights.title')}</h5>
            <div className="row mb-3">
              <div className="col-md-3">
                <strong>🔥 {t('tournament.playerPerformance.performanceLevels.excellent')}:</strong> {t('tournament.playerPerformance.insights.excellentDesc')}
              </div>
              <div className="col-md-3">
                <strong>👍 {t('tournament.playerPerformance.performanceLevels.good')}:</strong> {t('tournament.playerPerformance.insights.goodDesc')}
              </div>
              <div className="col-md-3">
                <strong>👌 {t('tournament.playerPerformance.performanceLevels.average')}:</strong> {t('tournament.playerPerformance.insights.averageDesc')}
              </div>
              <div className="col-md-3">
                <strong>💪 {t('tournament.playerPerformance.performanceLevels.needsWork')}:</strong> {t('tournament.playerPerformance.insights.needsWorkDesc')}
              </div>
            </div>

            <h6>{t('tournament.playerPerformance.insights.winAnalysisTitle')}</h6>
            <div className="row">
              <div className="col-md-3">
                <div className="text-success">
                  <strong>≥60%:</strong> {t('tournament.playerPerformance.insights.championLevel')}
                </div>
              </div>
              <div className="col-md-3">
                <div className="text-warning">
                  <strong>40-59%:</strong> {t('tournament.playerPerformance.insights.solidPerformer')}
                </div>
              </div>
              <div className="col-md-3">
                <div className="text-info">
                  <strong>20-39%:</strong> {t('tournament.playerPerformance.insights.developing')}
                </div>
              </div>
              <div className="col-md-3">
                <div className="text-danger">
                  <strong>&lt;20%:</strong> {t('tournament.playerPerformance.insights.learningPhase')}
                </div>
              </div>
            </div>

            {(() => {
              const avgWinRate = sortedPlayers.length > 0 ?
                (sortedPlayers.reduce((sum, p) => sum + (p.winRate || 0), 0) / sortedPlayers.length).toFixed(1) : 0;
              const highPerformers = sortedPlayers.filter(p => (p.winRate || 0) >= 60).length;
              const bestWinRate = sortedPlayers.length > 0 ?
                Math.max(...sortedPlayers.map(p => p.winRate || 0)).toFixed(1) : 0;

              return (
                <div className="mt-3 pt-3 border-top">
                  <div className="row text-center">
                    <div className="col-md-4">
                      <div className="h5 text-primary">{avgWinRate}%</div>
                      <small className="text-muted">{t('tournament.playerPerformance.insights.averageWinRate')}</small>
                    </div>
                    <div className="col-md-4">
                      <div className="h5 text-success">{bestWinRate}%</div>
                      <small className="text-muted">{t('tournament.playerPerformance.insights.bestWinRate')}</small>
                    </div>
                    <div className="col-md-4">
                      <div className="h5 text-warning">{highPerformers}</div>
                      <small className="text-muted">{t('tournament.playerPerformance.insights.highPerformers')}</small>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      </div>
    </div>
  );
};

TournamentPlayerPerformance.propTypes = {
  gameData: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default TournamentPlayerPerformance;
