import React from 'react';
import { useTranslation } from 'react-i18next';

// Simple fallback radar chart component
const SimpleRadarChart = () => {
  const { t } = useTranslation();
  
  return (
    <div className="card mb-4">
      <div className="card-header bg-purple text-white" style={{ backgroundColor: '#8A2BE2' }}>
        <h2>🎯 Player Strength Analysis</h2>
      </div>
      <div className="card-body">
        <div className="alert alert-info">
          <h4>📊 Chart Loading...</h4>
          <p>Radar chart functionality is temporarily simplified while we resolve compatibility issues.</p>
          <p>Player performance data is available in the Leaderboard and other charts.</p>
        </div>
      </div>
    </div>
  );
};

export default SimpleRadarChart;