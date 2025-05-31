import React, { Suspense, lazy } from 'react';
import './App.css';
import Leaderboard from './components/Leaderboard';
import GamesList from './components/GamesList';
import FallbackChart from './components/FallbackChart';

// Lazy load chart components to handle potential loading issues
const PlayerStatsChart = lazy(() => import('./components/PlayerStatsChart').catch(() => ({ default: () => <FallbackChart title="📊 Player Statistics" message="Player stats visualization is currently unavailable" /> })));
const PointsDistributionChart = lazy(() => import('./components/PointsDistributionChart').catch(() => ({ default: () => <FallbackChart title="🍩 Points Distribution" message="Points distribution visualization is currently unavailable" /> })));
const PlayerPerformanceChart = lazy(() => import('./components/PlayerPerformanceChart').catch(() => ({ default: () => <FallbackChart title="📈 Player Performance Over Time" message="Performance chart is currently unavailable" /> })));
const PlayerStrengthChart = lazy(() => import('./components/PlayerStrengthChart').catch(() => ({ default: () => <FallbackChart title="🎯 Player Strength Analysis" message="Player strength analysis is currently unavailable" /> })));
const GamesCalendarChart = lazy(() => import('./components/GamesCalendarChart').catch(() => ({ default: () => <FallbackChart title="📆 Games Calendar" message="Games calendar visualization is currently unavailable" /> })));

function App() {
  return (
    <div className="App">
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
        <div className="container">
          <span className="navbar-brand">Partners Competition App - Working!</span>
        </div>
      </nav>
      
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <Leaderboard />
          </div>
        </div>
        
        <div className="row mb-4">
          <div className="col-md-6">
            <Suspense fallback={<FallbackChart title="📊 Player Statistics" message="Loading chart..." />}>
              <PlayerStatsChart />
            </Suspense>
          </div>
          <div className="col-md-6">
            <Suspense fallback={<FallbackChart title="🍩 Points Distribution" message="Loading chart..." />}>
              <PointsDistributionChart />
            </Suspense>
          </div>
        </div>
        
        <div className="row mb-4">
          <div className="col-md-12">
            <Suspense fallback={<FallbackChart title="📈 Player Performance Over Time" message="Loading chart..." />}>
              <PlayerPerformanceChart />
            </Suspense>
          </div>
        </div>
        
        <div className="row mb-4">
          <div className="col-md-6">
            <Suspense fallback={<FallbackChart title="🎯 Player Strength Analysis" message="Loading chart..." />}>
              <PlayerStrengthChart />
            </Suspense>
          </div>
          <div className="col-md-6">
            <Suspense fallback={<FallbackChart title="📆 Games Calendar" message="Loading chart..." />}>
              <GamesCalendarChart />
            </Suspense>
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
          <p className="mb-0">Partners Competition App &copy; {new Date().getFullYear()}</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
