import React from 'react';
// Import with error handling for compatibility
import { ResponsiveCalendar } from '@nivo/calendar';
import { getGames } from '../utils/dataUtils';
import { useTranslation } from 'react-i18next';

const GamesCalendarChart = ({ t }) => {
  const { t: translate } = useTranslation();
  // Use provided t function if available, otherwise use local translate
  const tFunc = t || translate;
  const games = getGames();
  
  // Prepare data for the calendar chart
  // We need to count how many games were played on each date
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

  // Since our dataset might be small, let's add the current year's range
  const currentYear = new Date().getFullYear();
  const from = `${currentYear-1}-01-01`;
  const to = `${currentYear}-12-31`;

  try {
    return (
      <div className="card mb-4">
        <div className="card-header text-white" style={{ backgroundColor: '#20B2AA' }}>
          <h2>📆 {tFunc('charts.gamesCalendar.title')}</h2>
        </div>
        <div className="card-body">
          <div style={{ height: '200px' }}>
            <ResponsiveCalendar
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
                <strong>{tFunc('charts.gamesCalendar.tooltip.date', { date: day })}</strong>
                <div>{tFunc('charts.gamesCalendar.tooltip.games', { count: value })}</div>
              </div>
            )}
            />
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Calendar chart error:', error);
    return (
      <div className="card mb-4">
        <div className="card-header text-white" style={{ backgroundColor: '#20B2AA' }}>
          <h2>📆 {tFunc('charts.gamesCalendar.title')}</h2>
        </div>
        <div className="card-body">
          <div className="alert alert-warning">
            <h4>Chart temporarily unavailable</h4>
            <p>The calendar chart component encountered an error. Please try refreshing the page.</p>
            <p>Games data is still available in the games list below.</p>
            <details className="mt-2">
              <summary>Error details</summary>
              <pre className="small text-muted">{error.message}</pre>
            </details>
          </div>
        </div>
      </div>
    );
  }
};

export default GamesCalendarChart;
