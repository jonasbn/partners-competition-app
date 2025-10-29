import React from 'react';
import { useTranslation } from 'react-i18next';

// Simple fallback calendar component
const SimpleCalendarChart = () => {
  const { t } = useTranslation();
  
  // For now, just show a message about the calendar
  return (
    <div className="card mb-4">
      <div className="card-header text-white" style={{ backgroundColor: '#20B2AA' }}>
        <h2>📆 {t('charts.gamesCalendar.title') || 'Games Calendar'}</h2>
      </div>
      <div className="card-body">
        <div className="alert alert-info">
          <h4>📊 Chart Loading...</h4>
          <p>Calendar chart functionality is temporarily simplified while we resolve compatibility issues.</p>
          <p>Game dates and statistics are available in the Games List section below.</p>
        </div>
      </div>
    </div>
  );
};

export default SimpleCalendarChart;