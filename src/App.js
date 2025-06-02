import React, { useEffect } from 'react';
import './App.css';
import Leaderboard from './components/Leaderboard';
import GamesList from './components/GamesList';
import TeamStatistics from './components/TeamStatistics';
import ThemeToggle from './components/ThemeToggle';
import LanguageSelector from './components/LanguageSelector';
import SummaryCards from './components/SummaryCards';
import PlayerStatsChart from './components/PlayerStatsChart';
import PlayerPerformanceChart from './components/PlayerPerformanceChart';
import GamesCalendarChart from './components/GamesCalendarChart';
import TeamCombinationChart from './components/TeamCombinationChart';
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
              <ThemeToggle />
            </ErrorBoundary>
          </div>
        </div>
      </nav>
      
      <div className="container">
        <ErrorBoundary name="SummaryCards">
          <SummaryCards />
        </ErrorBoundary>
        
        <div className="row">
          <div className="col-md-12">
            <ErrorBoundary name="Leaderboard">
              <Leaderboard />
            </ErrorBoundary>
          </div>
        </div>

        <div className="row">
          <div className="col-md-6">
            <ErrorBoundary name="PlayerStatsChart">
              <PlayerStatsChart />
            </ErrorBoundary>
          </div>
          <div className="col-md-6">
            <ErrorBoundary name="PlayerPerformanceChart">
              <PlayerPerformanceChart />
            </ErrorBoundary>
          </div>
        </div>
        
        <div className="row">
          <div className="col-md-6">
            <ErrorBoundary name="GamesCalendarChart">
              <GamesCalendarChart />
            </ErrorBoundary>
          </div>
          <div className="col-md-6">
            <ErrorBoundary name="TeamCombinationChart">
              <TeamCombinationChart />
            </ErrorBoundary>
          </div>
        </div>
        
        <div className="row">
          <div className="col-md-6">
            <ErrorBoundary name="TeamStatistics">
              <TeamStatistics />
            </ErrorBoundary>
          </div>
          <div className="col-md-6">
            <ErrorBoundary name="GamesList">
              <GamesList />
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
