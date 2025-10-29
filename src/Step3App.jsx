import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Step 2: Data utilities (confirmed working)
import { getGames, getLeaderboardData } from './utils/dataUtils';

// Step 3: Test basic components one by one
import Leaderboard from './components/Leaderboard';
import GamesList from './components/GamesList';

function Step3App() {
  console.log('Step3App is rendering...');

  let gamesData = null;
  let leaderboardData = null;
  let dataError = null;
  let componentError = null;

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
        <div className="alert alert-info">
          <h4>✅ Step 3: Basic Components Testing</h4>
          <p>Testing Leaderboard and GamesList components...</p>
        </div>

        {dataError && (
          <div className="alert alert-danger">
            <h4>❌ Data Error</h4>
            <p>{dataError}</p>
          </div>
        )}

        {componentError && (
          <div className="alert alert-danger">
            <h4>❌ Component Error</h4>
            <p>{componentError}</p>
          </div>
        )}

        <div className="row">
          <div className="col-md-12">
            <div className="card mb-4">
              <div className="card-header bg-primary text-white">
                <h3>🏆 Testing: Leaderboard Component</h3>
              </div>
              <div className="card-body">
                {(() => {
                  try {
                    return <Leaderboard />;
                  } catch (error) {
                    console.error('Leaderboard component error:', error);
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
        </div>

        <div className="row">
          <div className="col-md-12">
            <div className="card mb-4">
              <div className="card-header bg-success text-white">
                <h3>🎮 Testing: GamesList Component</h3>
              </div>
              <div className="card-body">
                {(() => {
                  try {
                    return <GamesList />;
                  } catch (error) {
                    console.error('GamesList component error:', error);
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

        <div className="row">
          <div className="col-md-12">
            <div className="card">
              <div className="card-header bg-info text-white">
                <h3>📊 Progress Status</h3>
              </div>
              <div className="card-body">
                <p><strong>Step 1:</strong> ✅ React + Bootstrap</p>
                <p><strong>Step 2:</strong> ✅ Data utilities</p>
                <p><strong>Step 3:</strong> 🧪 Basic components testing</p>
                <p><strong>Data loaded:</strong> {dataError ? '❌' : '✅'}</p>
                <p><strong>Components:</strong> Check above for individual results</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <footer className="bg-light text-center text-muted py-3 mt-4">
        <div className="container">
          <small>Partners Competition App - Step 3: Basic Components Testing</small>
        </div>
      </footer>
    </div>
  );
}

export default Step3App;