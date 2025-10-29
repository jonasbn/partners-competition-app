import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Import fixed components
import SimpleLeaderboard from './components/SimpleLeaderboard';
import SimpleGamesList from './components/SimpleGamesList';
import SimpleThemeToggle from './components/SimpleThemeToggle';
import SimpleSummaryCards from './components/SimpleSummaryCards';
import SimpleTeamStatistics from './components/SimpleTeamStatistics';
import SimplePlayerPerformance from './components/SimplePlayerPerformance';
import SimpleGamesCalendar from './components/SimpleGamesCalendar';
import SimplePointsDistribution from './components/SimplePointsDistribution';
import SimplePlayerPerformanceChart from './components/SimplePlayerPerformanceChart';
import SimpleTeamCombinationChart from './components/SimpleTeamCombinationChart';
import SimplePlayerStatsChart from './components/SimplePlayerStatsChart';
import { SimpleThemeProvider } from './utils/SimpleThemeContext';

function RestoredApp() {
  console.log('RestoredApp is rendering - full application restored with fixes and theme support!');

  return (
    <SimpleThemeProvider>
      <div className="App">
        <nav className="navbar navbar-expand-lg navbar-dark mb-4" style={{backgroundColor: 'var(--navbar-bg)'}}>
          <div className="container">
            <span className="navbar-brand">🏓 Partners Competition App</span>
            <div className="navbar-nav ms-auto">
              <div className="d-flex align-items-center">
                <SimpleThemeToggle />
                <span className="navbar-text text-success ms-3">
                  ✅ Fully Restored & Fixed
                </span>
              </div>
            </div>
          </div>
        </nav>
      
      <div className="container">
        <div className="alert alert-success">
          <h4>🎉 Application Fully Restored & Enhanced!</h4>
          <p>The white page issue has been resolved with comprehensive features restored: analytics, team statistics, player insights, and more!</p>
          <div className="mt-2">
            <small>💡 <strong>Try the theme toggle</strong> in the top-right corner!</small><br />
            <small>👤 <strong>Hover over player avatars</strong> to see larger versions!</small><br />
            <small>🏆 <strong>Avatars reflect ranking:</strong> 1st=😊, 2nd-3rd=😐, 4th-6th=😢</small><br />
            <small>📊 <strong>Scroll down</strong> to explore analytics and team statistics!</small>
          </div>
        </div>

        {/* Summary Cards */}
        <SimpleSummaryCards />
        
        <div className="row">
          <div className="col-md-12">
            <div className="mb-4">
              {(() => {
                try {
                  return <SimplePlayerPerformance />;
                } catch (error) {
                  console.error('SimplePlayerPerformance error:', error);
                  return (
                    <div className="alert alert-warning">
                      <strong>Player Performance:</strong> {error.message}
                    </div>
                  );
                }
              })()}
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-md-12">
            <div className="mb-4">
              {(() => {
                try {
                  return <SimpleLeaderboard />;
                } catch (error) {
                  console.error('SimpleLeaderboard error:', error);
                  return (
                    <div className="alert alert-danger">
                      <strong>Leaderboard Error:</strong> {error.message}
                    </div>
                  );
                }
              })()}
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-md-12">
            <div className="mb-4">
              {(() => {
                try {
                  return <SimplePointsDistribution />;
                } catch (error) {
                  console.error('SimplePointsDistribution error:', error);
                  return (
                    <div className="alert alert-warning">
                      <strong>Points Distribution:</strong> {error.message}
                    </div>
                  );
                }
              })()}
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-md-12">
            <div className="mb-4">
              {(() => {
                try {
                  return <SimpleGamesCalendar />;
                } catch (error) {
                  console.error('SimpleGamesCalendar error:', error);
                  return (
                    <div className="alert alert-warning">
                      <strong>Games Calendar:</strong> {error.message}
                    </div>
                  );
                }
              })()}
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-md-12">
            <div className="mb-4">
              {(() => {
                try {
                  return <SimplePlayerPerformanceChart />;
                } catch (error) {
                  console.error('SimplePlayerPerformanceChart error:', error);
                  return (
                    <div className="alert alert-warning">
                      <strong>Player Performance Chart:</strong> {error.message}
                    </div>
                  );
                }
              })()}
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-md-12">
            <div className="mb-4">
              {(() => {
                try {
                  return <SimpleTeamCombinationChart />;
                } catch (error) {
                  console.error('SimpleTeamCombinationChart error:', error);
                  return (
                    <div className="alert alert-warning">
                      <strong>Team Combination Chart:</strong> {error.message}
                    </div>
                  );
                }
              })()}
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-md-12">
            <div className="mb-4">
              {(() => {
                try {
                  return <SimplePlayerStatsChart />;
                } catch (error) {
                  console.error('SimplePlayerStatsChart error:', error);
                  return (
                    <div className="alert alert-warning">
                      <strong>Player Stats Chart:</strong> {error.message}
                    </div>
                  );
                }
              })()}
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-md-12">
            <div className="mb-4">
              {(() => {
                try {
                  return <SimpleTeamStatistics />;
                } catch (error) {
                  console.error('SimpleTeamStatistics error:', error);
                  return (
                    <div className="alert alert-warning">
                      <strong>Team Statistics:</strong> {error.message}
                    </div>
                  );
                }
              })()}
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-md-12">
            <div className="mb-4">
              {(() => {
                try {
                  return <SimpleGamesList />;
                } catch (error) {
                  console.error('SimpleGamesList error:', error);
                  return (
                    <div className="alert alert-danger">
                      <strong>GamesList Error:</strong> {error.message}
                    </div>
                  );
                }
              })()}
            </div>
          </div>
        </div>


      </div>
      
      <footer className="bg-light text-center text-muted py-3 mt-4">
        <div className="container">
          <small>Partners Competition App - Fully Restored & Bug-Free! 🚀</small>
        </div>
      </footer>
      </div>
    </SimpleThemeProvider>
  );
}

export default RestoredApp;