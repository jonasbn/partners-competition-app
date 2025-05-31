import React from 'react';

const FallbackChart = ({ title, message }) => {
  return (
    <div className="card mb-4">
      <div className="card-header bg-primary text-white">
        <h2>{title || 'Chart'}</h2>
      </div>
      <div className="card-body">
        <div style={{ height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
          <div className="alert alert-warning">
            <h4>Chart Temporarily Unavailable</h4>
            <p>{message || 'The chart visualization is currently loading or unavailable.'}</p>
          </div>
          <div className="mt-3">
            <p>This is a placeholder for a data visualization that would normally show:</p>
            <ul className="text-left">
              <li>Player performance data over time</li>
              <li>Score distribution</li>
              <li>Game history</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FallbackChart;
