import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getGames } from '../utils/dataUtils';

// Robust calendar chart with dynamic import
const RobustCalendarChart = () => {
  const { t } = useTranslation();
  const [CalendarComponent, setCalendarComponent] = useState(null);
  const [loadError, setLoadError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadCalendarChart = async () => {
      try {
        // Dynamic import with error handling
        const nivoModule = await import('@nivo/calendar');
        
        if (isMounted && nivoModule.ResponsiveCalendar) {
          setCalendarComponent(() => nivoModule.ResponsiveCalendar);
          setLoadError(null);
        } else {
          throw new Error('ResponsiveCalendar not found in module');
        }
      } catch (error) {
        console.error('Failed to load calendar chart:', error);
        if (isMounted) {
          setLoadError(error.message);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadCalendarChart();

    return () => {
      isMounted = false;
    };
  }, []);

  const games = getGames();
  
  // Prepare data for the calendar chart
  const calendarData = games.reduce((acc, game) => {
    const date = game.gameDate;
    const existingEntry = acc.find(entry => entry.day === date);
    
    if (existingEntry) {
      existingEntry.value += 1;
    } else {
      acc.push({
        day: date,
        value: 1
      });
    }
    
    return acc;
  }, []);

  const currentYear = new Date().getFullYear();
  const from = `${currentYear-1}-01-01`;
  const to = `${currentYear}-12-31`;

  if (isLoading) {
    return (
      <div className="card mb-4">
        <div className="card-header text-white" style={{ backgroundColor: '#20B2AA' }}>
          <h2>📆 {t('charts.gamesCalendar.title') || 'Games Calendar'}</h2>
        </div>
        <div className="card-body">
          <div className="d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
            <div className="spinner-border text-info" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loadError || !CalendarComponent) {
    return (
      <div className="card mb-4">
        <div className="card-header text-white" style={{ backgroundColor: '#20B2AA' }}>
          <h2>📆 {t('charts.gamesCalendar.title') || 'Games Calendar'}</h2>
        </div>
        <div className="card-body">
          <div className="alert alert-info">
            <h4>📊 Chart Unavailable</h4>
            <p>The calendar chart is temporarily unavailable due to a loading issue.</p>
            <p>Games data is still available in the Games List section below.</p>
            <div className="mt-3">
              <h6>Games Summary:</h6>
              <p>Total games played: <strong>{games.length}</strong></p>
              <p>Date range: <strong>{games.length > 0 ? `${games[0].gameDate} to ${games[games.length-1].gameDate}` : 'No games yet'}</strong></p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  try {
    return (
      <div className="card mb-4">
        <div className="card-header text-white" style={{ backgroundColor: '#20B2AA' }}>
          <h2>📆 {t('charts.gamesCalendar.title') || 'Games Calendar'}</h2>
        </div>
        <div className="card-body">
          <div style={{ height: '200px' }}>
            <CalendarComponent
              data={calendarData}
              from={from}
              to={to}
              emptyColor="#eeeeee"
              colors={['#61cdbb', '#97e3d5', '#e8c1a0', '#f47560']}
              margin={{ top: 40, right: 40, bottom: 40, left: 40 }}
              yearSpacing={40}
              monthBorderColor="#ffffff"
              dayBorderWidth={2}
              dayBorderColor="#ffffff"
              theme={{
                labels: {
                  text: {
                    fill: 'var(--text-color)'
                  }
                },
                tooltip: {
                  container: {
                    background: 'var(--card-bg)',
                    color: 'var(--text-color)',
                    boxShadow: '0 3px 9px rgba(0, 0, 0, 0.5)'
                  }
                }
              }}
              legends={[
                {
                  anchor: 'bottom-right',
                  direction: 'row',
                  translateY: 36,
                  itemCount: 4,
                  itemWidth: 42,
                  itemHeight: 36,
                  itemsSpacing: 14,
                  itemDirection: 'right-to-left'
                }
              ]}
              tooltip={({ day, value }) => (
                <div
                  style={{
                    padding: 12,
                    background: 'var(--card-bg)',
                    borderRadius: 4,
                    boxShadow: '0 3px 8px rgba(0, 0, 0, 0.15)',
                    color: 'var(--text-color)'
                  }}
                >
                  <strong>{t('charts.gamesCalendar.tooltip.date', { date: day }) || `Date: ${day}`}</strong>
                  <div>{t('charts.gamesCalendar.tooltip.games', { count: value }) || `Games: ${value}`}</div>
                </div>
              )}
            />
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Calendar chart render error:', error);
    return (
      <div className="card mb-4">
        <div className="card-header text-white" style={{ backgroundColor: '#20B2AA' }}>
          <h2>📆 {t('charts.gamesCalendar.title') || 'Games Calendar'}</h2>
        </div>
        <div className="card-body">
          <div className="alert alert-warning">
            <h4>Chart Error</h4>
            <p>The calendar chart encountered an error while rendering.</p>
            <p>Games data is available in the Games List section below.</p>
          </div>
        </div>
      </div>
    );
  }
};

export default RobustCalendarChart;