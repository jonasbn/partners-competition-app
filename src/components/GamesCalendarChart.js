import React from 'react';
// Modified import to ensure compatibility
import { ResponsiveCalendar } from '@nivo/calendar';
import { getGames } from '../utils/dataUtils';

const GamesCalendarChart = () => {
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

  return (
    <div className="card mb-4">
      <div className="card-header text-white" style={{ backgroundColor: '#20B2AA' }}>
        <h2>📆 Games Calendar</h2>
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
          />
        </div>
      </div>
    </div>
  );
};

export default GamesCalendarChart;
