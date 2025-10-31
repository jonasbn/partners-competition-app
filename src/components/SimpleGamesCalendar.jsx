import React from 'react';
import { useTranslation } from 'react-i18next';
import { getGames } from '../utils/dataUtils';

const SimpleGamesCalendar = () => {
  const { t } = useTranslation();
  console.log('SimpleGamesCalendar rendering...');
  
  let games = [];
  let dataError = null;

  try {
    games = getGames() || [];
    console.log('Games calendar data loaded:', games.length, 'games');
  } catch (error) {
    console.error('Error loading games calendar data:', error);
    dataError = error.message;
  }

  if (dataError) {
    return (
      <div className="card">
        <div className="card-header bg-danger text-white">
          <h2>❌ {t('gamesCalendar.error')}</h2>
        </div>
        <div className="card-body">
          <div className="alert alert-danger">
            <strong>{t('gamesList.errorLoading')}:</strong> {dataError}
          </div>
        </div>
      </div>
    );
  }

  if (!games || games.length === 0) {
    return (
      <div className="card">
        <div className="card-header bg-info text-white">
          <h2>📅 {t('gamesCalendar.title')}</h2>
        </div>
        <div className="card-body">
          <div className="alert alert-info">
            <h4>{t('gamesList.noGames')}</h4>
            <p>{t('gamesList.startPlaying')}</p>
          </div>
        </div>
      </div>
    );
  }

  // Group games by date
  const gamesByDate = games.reduce((acc, game) => {
    const date = game.gameDate;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(game);
    return acc;
  }, {});

  // Sort dates
  const sortedDates = Object.keys(gamesByDate).sort((a, b) => new Date(a) - new Date(b));

  // Get date range for display
  const firstDate = sortedDates[0] ? new Date(sortedDates[0]) : new Date();
  const lastDate = sortedDates[sortedDates.length - 1] ? new Date(sortedDates[sortedDates.length - 1]) : new Date();
  
  const formatDate = (dateStr) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
      });
    } catch {
      return dateStr;
    }
  };

  const getGameIntensity = (gameCount) => {
    if (gameCount >= 4) return 'high';
    if (gameCount >= 2) return 'medium';
    return 'low';
  };

  const getIntensityClass = (intensity) => {
    switch (intensity) {
      case 'high': return 'bg-success';
      case 'medium': return 'bg-warning';
      case 'low': return 'bg-info';
      default: return 'bg-light';
    }
  };

  // Calculate some stats
  const totalGames = games.length;
  const totalDays = sortedDates.length;
  const avgGamesPerDay = totalDays > 0 ? (totalGames / totalDays).toFixed(1) : 0;
  const maxGamesInDay = Math.max(...Object.values(gamesByDate).map(g => g.length));

  return (
    <div className="card mb-4">
      <div className="card-header bg-primary text-white">
        <h2>📅 {t('gamesCalendar.timelineTitle')}</h2>
      </div>
      <div className="card-body">
        {/* Calendar Stats */}
        <div className="row mb-4">
          <div className="col-md-3">
            <div className="text-center">
              <div className="h4 text-primary">{totalGames}</div>
              <small className="text-muted">{t('gamesCalendar.stats.totalGames')}</small>
            </div>
          </div>
          <div className="col-md-3">
            <div className="text-center">
              <div className="h4 text-info">{totalDays}</div>
              <small className="text-muted">{t('gamesCalendar.stats.activeDays')}</small>
            </div>
          </div>
          <div className="col-md-3">
            <div className="text-center">
              <div className="h4 text-success">{avgGamesPerDay}</div>
              <small className="text-muted">{t('gamesCalendar.stats.avgPerDay')}</small>
            </div>
          </div>
          <div className="col-md-3">
            <div className="text-center">
              <div className="h4 text-warning">{maxGamesInDay}</div>
              <small className="text-muted">{t('gamesCalendar.stats.maxPerDay')}</small>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="mb-4">
          <h5>📊 {t('gamesCalendar.timeline.title')}</h5>
          <div className="row">
            {sortedDates.map((date, index) => {
              const dayGames = gamesByDate[date];
              const intensity = getGameIntensity(dayGames.length);
              const intensityClass = getIntensityClass(intensity);
              
              return (
                <div key={date} className="col-md-2 col-sm-3 col-4 mb-3">
                  <div className={`card ${intensityClass} text-white h-100`}>
                    <div className="card-body text-center p-2">
                      <div className="small font-weight-bold">
                        {formatDate(date)}
                      </div>
                      <div className="h5 mb-1">{dayGames.length}</div>
                      <div className="small">
                        {dayGames.length === 1 ? t('gamesCalendar.timeline.game') : t('gamesCalendar.timeline.games')}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="alert alert-light">
          <h6>📈 {t('gamesCalendar.levels.title')}</h6>
          <div className="row">
            <div className="col-md-4">
              <span className="badge bg-info me-2">{t('gamesCalendar.levels.low')}</span>
              <small>{t('gamesCalendar.levels.lowDesc')}</small>
            </div>
            <div className="col-md-4">
              <span className="badge bg-warning me-2">{t('gamesCalendar.levels.medium')}</span>
              <small>{t('gamesCalendar.levels.mediumDesc')}</small>
            </div>
            <div className="col-md-4">
              <span className="badge bg-success me-2">{t('gamesCalendar.levels.high')}</span>
              <small>{t('gamesCalendar.levels.highDesc')}</small>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-4">
          <h6>🕒 {t('gamesCalendar.recent.title')}</h6>
          <div className="table-responsive">
            <table className="table table-sm">
              <thead>
                <tr>
                  <th>{t('gamesCalendar.recent.date')}</th>
                  <th>{t('gamesCalendar.recent.games')}</th>
                  <th>{t('gamesCalendar.recent.teams')}</th>
                </tr>
              </thead>
              <tbody>
                {sortedDates.slice(-5).reverse().map(date => {
                  const dayGames = gamesByDate[date];
                  const totalTeams = dayGames.reduce((sum, game) => sum + (game.teams?.length || 0), 0);
                  return (
                    <tr key={date}>
                      <td>{formatDate(date)}</td>
                      <td>
                        <span className={`badge ${getIntensityClass(getGameIntensity(dayGames.length))}`}>
                          {dayGames.length}
                        </span>
                      </td>
                      <td>{totalTeams} {t('gamesCalendar.recent.teamsPlayed')}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleGamesCalendar;