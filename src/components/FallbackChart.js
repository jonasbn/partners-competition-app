import React from 'react';
import { useTranslation } from 'react-i18next';

const FallbackChart = ({ title, message }) => {
  const { t } = useTranslation();
  
  return (
    <div className="card mb-4">
      <div className="card-header bg-primary text-white">
        <h2>{title || t('charts.default.title')}</h2>
      </div>
      <div className="card-body">
        <div style={{ height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
          <div className="alert alert-warning">
            <h4>{t('charts.unavailable.header')}</h4>
            <p>{message || t('charts.unavailable.message')}</p>
          </div>
          <div className="mt-3">
            <p>{t('charts.fallback.description')}</p>
            <ul className="text-left">
              <li>{t('charts.fallback.item1')}</li>
              <li>{t('charts.fallback.item2')}</li>
              <li>{t('charts.fallback.item3')}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FallbackChart;
