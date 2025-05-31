import React from 'react';
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
import { useTranslation } from 'react-i18next';

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
            <PlayerStatsChart t={t} />
          </div>
          <div className="col-md-6">
            <GamesCalendarChart t={t} />
          </div>
        </div>
        
        <div className="row mb-4">
          <div className="col-md-12">
            <PlayerPerformanceChart t={t} />
          </div>
        </div>
        
        <div className="row mb-4">
          <div className="col-md-12">
            <TeamStatistics />
          </div>
        </div>
        
        <div className="row mb-4">
          <div className="col-md-12">
            <TeamCombinationChart t={t} />
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
