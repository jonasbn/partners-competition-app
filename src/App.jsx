import React, { useEffect, useContext } from 'react';
import './App.css';
import SimpleLeaderboard from './components/SimpleLeaderboard';
import SimpleGamesList from './components/SimpleGamesList';
import SimpleThemeToggle from './components/SimpleThemeToggle';
import SimpleSummaryCards from './components/SimpleSummaryCards';
import SimpleTeamStatistics from './components/SimpleTeamStatistics';
import SimplePlayerPerformance from './components/SimplePlayerPerformance';
import SimpleGamesCalendar from './components/SimpleGamesCalendar';
import TournamentChampion2025 from './components/TournamentChampion2025';
import LanguageSelector from './components/LanguageSelector';
import YearSelector from './components/YearSelector';
import ErrorBoundary from './components/ErrorBoundary';
import { useTranslation } from 'react-i18next';
import Logger from './utils/logger';
import { YearContext } from './utils/YearContext';
import { getGamesDataForYear } from './utils/dataUtils';

function App() {
  const { t } = useTranslation();
  const { selectedYear } = useContext(YearContext);
  const currentYearData = getGamesDataForYear(selectedYear);

  // Log application startup and lifecycle events
  useEffect(() => {
    // Guard against SSR/server-side rendering
    const safeNavigatorAccess = () => {
      if (typeof navigator === 'undefined') {
        return { userAgent: 'Unknown', language: 'en' };
      }
      return {
        userAgent: navigator.userAgent || 'Unknown',
        language: navigator.language || 'en'
      };
    };

    const safeWindowAccess = () => {
      if (typeof window === 'undefined') {
        return { width: 0, height: 0 };
      }
      return {
        width: window.innerWidth || 0,
        height: window.innerHeight || 0
      };
    };

    const navInfo = safeNavigatorAccess();
    const viewportInfo = safeWindowAccess();

    Logger.info('Partners Competition App started', {
      timestamp: new Date().toISOString(),
      userAgent: navInfo.userAgent,
      language: navInfo.language,
      viewport: viewportInfo
    });

    // Log when app component mounts
    Logger.event('app_mounted, echo: ' + import.meta.env.VITE_ECHO);

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
            <ErrorBoundary name="YearSelector">
              <YearSelector />
            </ErrorBoundary>
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
        {/* Tournament 2025 Final Results — only shown when 2025 is selected */}
        {selectedYear === 2025 && (
          <ErrorBoundary name="TournamentChampion2025">
            <TournamentChampion2025 gameData={currentYearData} />
          </ErrorBoundary>
        )}

        {/* First row: Summary Cards (Current leader, Best team, Game statistics) */}
        <ErrorBoundary name="SummaryCards">
          <SimpleSummaryCards gameData={currentYearData} />
        </ErrorBoundary>

        {/* Second component: Leaderboard */}
        <div className="row">
          <div className="col-md-12">
            <ErrorBoundary name="Leaderboard">
              <SimpleLeaderboard gameData={currentYearData} />
            </ErrorBoundary>
          </div>
        </div>

        {/* Third component: Player Performance Analysis */}
        <div className="row">
          <div className="col-md-12">
            <ErrorBoundary name="PlayerPerformanceAnalysis">
              <SimplePlayerPerformance gameData={currentYearData} />
            </ErrorBoundary>
          </div>
        </div>

        {/* Fourth component: Game Calendar */}
        <div className="row">
          <div className="col-md-12">
            <ErrorBoundary name="GamesCalendar">
              <SimpleGamesCalendar gameData={currentYearData} />
            </ErrorBoundary>
          </div>
        </div>

        {/* Fifth component: Team Statistics */}
        <div className="row">
          <div className="col-md-12">
            <ErrorBoundary name="TeamStatistics">
              <SimpleTeamStatistics gameData={currentYearData} />
            </ErrorBoundary>
          </div>
        </div>

        {/* Sixth component: Recent Game Outcomes */}
        <div className="row">
          <div className="col-md-12">
            <ErrorBoundary name="GamesList">
              <SimpleGamesList gameData={currentYearData} />
            </ErrorBoundary>
          </div>
        </div>
      </div>
      
      <footer className="bg-light text-center text-muted py-3 mt-4">
        <div className="container">
          <small>{t('app.footer', { year: new Date().getFullYear() })}</small>
        </div>
      </footer>
    </div>
  );
}

export default App;
