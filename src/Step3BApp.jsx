import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Step 2: Data utilities (confirmed working)
import { getGames, getLeaderboardData } from './utils/dataUtils';

// Step 3B: Test i18n-free basic components
import SimpleLeaderboard from './components/SimpleLeaderboard';
import SimpleGamesList from './components/SimpleGamesList';

function Step3BApp() {
  console.log('Step3BApp is rendering...');

  let gamesData = null;
  let leaderboardData = null;
  let dataError = null;

  try {
    gamesData = getGames();
    leaderboardData = getLeaderboardData();
    console.log('Data loaded successfully');
  } catch (error) {
    dataError = error.message;
    console.error('Data loading error:', error);
  }

  return (
    <div className="App">
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
        <div className="container">
          <span className="navbar-brand">🏓 Partners Competition App</span>
        </div>
      </nav>
      
      <div className="container">
        <div className="alert alert-success">
          <h4>✅ Step 3B: i18n-Free Components</h4>
          <p>Testing components without internationalization dependencies...</p>
        </div>

        {dataError && (
          <div className="alert alert-danger">
            <h4>❌ Data Error</h4>
            <p>{dataError}</p>
          </div>
        )}

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

        <div className="row">
          <div className="col-md-12">
            <div className="card">
              <div className="card-header bg-info text-white">
                <h3>🔍 Diagnosis Results</h3>
              </div>
              <div className="card-body">
                <p><strong>Step 1:</strong> ✅ React + Bootstrap</p>
                <p><strong>Step 2:</strong> ✅ Data utilities</p>
                <p><strong>Step 3A (with i18n):</strong> ❌ White page (confirmed i18n issue)</p>
                <p><strong>Step 3B (without i18n):</strong> 🧪 Testing now</p>
                <p><strong>Root cause:</strong> {dataError ? 'Data loading' : 'Likely i18n/react-i18next'}</p>
                
                <div className="mt-3">
                  <h5>If this works:</h5>
                  <ul>
                    <li>✅ Components themselves are fine</li>
                    <li>❌ i18n is the problematic dependency</li>
                    <li>🎯 Solution: Use i18n-free components or fix i18n setup</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <footer className="bg-light text-center text-muted py-3 mt-4">
        <div className="container">
          <small>Partners Competition App - Step 3B: i18n-Free Components Test</small>
        </div>
      </footer>
    </div>
  );
}

export default Step3BApp;