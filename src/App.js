import React, { Suspense, lazy } from 'react';
import './App.css';
import Leaderboard from './components/Leaderboard';
import GamesList from './components/GamesList';
import TeamStatistics from './components/TeamStatistics';
import ThemeToggle from './components/ThemeToggle';
import LanguageSelector from './components/LanguageSelector';
import FallbackChart from './components/FallbackChart';
import SummaryCards from './components/SummaryCards';
import { useTranslation } from 'react-i18next';

// Lazy load chart components to handle potential loading issues
const PlayerStatsChart = lazy(() => import('./components/PlayerStatsChart').catch(() => ({ default: ({ t }) => <FallbackChart title={t('charts.playerStats.title')} message={t('charts.playerStats.unavailable')} /> })));
const PlayerPerformanceChart = lazy(() => import('./components/PlayerPerformanceChart').catch(() => ({ default: ({ t }) => <FallbackChart title={t('charts.playerPerformance.title')} message={t('charts.playerPerformance.unavailable')} /> })));
const GamesCalendarChart = lazy(() => import('./components/GamesCalendarChart').catch(() => ({ default: ({ t }) => <FallbackChart title={t('charts.gamesCalendar.title')} message={t('charts.gamesCalendar.unavailable')} /> })));

function App() {
  const { t } = useTranslation();
  
  return (
    <div className="App">
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
        <div className="container">
          <span className="navbar-brand">{t('app.title')}</span>
          <div className="d-flex">
            <LanguageSelector />
            <ThemeToggle />
          </div>
        </div>
      </nav>
      
      <div className="container">
        <SummaryCards />
        
        <div className="row">
          <div className="col-md-12">
            <Leaderboard />
          </div>
        </div>
        
        <div className="row mb-4">
          <div className="col-md-6">
            <Suspense fallback={<FallbackChart title={t('charts.playerStats.title')} message={t('charts.playerStats.loading')} />}>
              <PlayerStatsChart t={t} />
            </Suspense>
          </div>
          <div className="col-md-6">
            <Suspense fallback={<FallbackChart title={t('charts.gamesCalendar.title')} message={t('charts.gamesCalendar.loading')} />}>
              <GamesCalendarChart t={t} />
            </Suspense>
          </div>
        </div>
        
        <div className="row mb-4">
          <div className="col-md-12">
            <Suspense fallback={<FallbackChart title={t('charts.playerPerformance.title')} message={t('charts.playerPerformance.loading')} />}>
              <PlayerPerformanceChart t={t} />
            </Suspense>
          </div>
        </div>
        
        <div className="row mb-4">
          <div className="col-md-12">
            <TeamStatistics />
          </div>
        </div>
        
        <div className="row">
          <div className="col-md-12">
            <GamesList />
          </div>
        </div>
      </div>
      
      <footer className="mt-5 py-3 bg-light text-center">
        <div className="container">
          <p className="mb-0">{t('app.footer', { year: new Date().getFullYear() })}</p>
          <p className="small text-muted">{t('app.createdWith')}</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
