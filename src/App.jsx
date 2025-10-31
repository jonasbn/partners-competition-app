import React, { useEffect } from 'react';
import './App.css';
import SimpleLeaderboard from './components/SimpleLeaderboard';
import SimpleGamesList from './components/SimpleGamesList';
import SimpleThemeToggle from './components/SimpleThemeToggle';
import SimpleSummaryCards from './components/SimpleSummaryCards';
import SimpleTeamStatistics from './components/SimpleTeamStatistics';
import SimplePlayerPerformance from './components/SimplePlayerPerformance';
import SimpleGamesCalendar from './components/SimpleGamesCalendar';
import LanguageSelector from './components/LanguageSelector';
import ErrorBoundary from './components/ErrorBoundary';
import { useTranslation } from 'react-i18next';
import Logger from './utils/logger';

function App() {
  const { t } = useTranslation();

  // Log application startup and lifecycle events
  useEffect(() => {
    Logger.info('Partners Competition App started', {
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      language: navigator.language,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      }
    });

    // Log when app component mounts
    Logger.event('app_mounted');

    // Clean up function for when component unmounts
    return () => {
      Logger.event('app_unmounting');
      Logger.flush();
    };
  }, []);

  return (
    <div className="App">
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
        <div className="container">
          <span className="navbar-brand">{t('app.title')}</span>
          <div className="d-flex">
            <ErrorBoundary name="LanguageSelector">
              <LanguageSelector />
            </ErrorBoundary>
            <ErrorBoundary name="ThemeToggle">
              <SimpleThemeToggle />
            </ErrorBoundary>
          </div>
        </div>
      </nav>
      
      <div className="container">
        {/* First row: Summary Cards (Current leader, Best team, Game statistics) */}
        <ErrorBoundary name="SummaryCards">
          <SimpleSummaryCards />
        </ErrorBoundary>
        
        {/* Second component: Leaderboard */}
        <div className="row">
          <div className="col-md-12">
            <ErrorBoundary name="Leaderboard">
              <SimpleLeaderboard />
            </ErrorBoundary>
          </div>
        </div>

        {/* Third component: Player Performance Analysis */}
        <div className="row">
          <div className="col-md-12">
            <ErrorBoundary name="PlayerPerformanceAnalysis">
              <SimplePlayerPerformance />
            </ErrorBoundary>
          </div>
        </div>
        
        {/* Fourth component: Game Calendar */}
        <div className="row">
          <div className="col-md-12">
            <ErrorBoundary name="GamesCalendar">
              <SimpleGamesCalendar />
            </ErrorBoundary>
          </div>
        </div>
        
        {/* Fifth component: Team Statistics */}
        <div className="row">
          <div className="col-md-12">
            <ErrorBoundary name="TeamStatistics">
              <SimpleTeamStatistics />
            </ErrorBoundary>
          </div>
        </div>
        
        {/* Sixth component: Recent Game Outcomes */}
        <div className="row">
          <div className="col-md-12">
            <ErrorBoundary name="GamesList">
              <SimpleGamesList />
            </ErrorBoundary>
          </div>
        </div>
      </div>
      
      <footer className="bg-light text-center text-muted py-3 mt-4">
        <div className="container">
          <small>{t('app.footer')}</small>
        </div>
      </footer>
    </div>
  );
}

export default App;
