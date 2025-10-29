import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Step 2: Test data utilities
import { getGames, getLeaderboardData } from './utils/dataUtils';

function Step2App() {
  console.log('Step2App is rendering...');

  // Test data loading
  let gamesData = null;
  let leaderboardData = null;
  let dataError = null;

  try {
    gamesData = getGames();
    leaderboardData = getLeaderboardData();
    console.log('Data loaded successfully:', { gamesData, leaderboardData });
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
          <h4>✅ Step 2: Data Layer Testing</h4>
          <p>Testing data utilities and game data loading...</p>
        </div>

        {dataError ? (
          <div className="alert alert-danger">
            <h4>❌ Data Loading Error</h4>
            <p><strong>Error:</strong> {dataError}</p>
            <p>The data utilities are causing issues. This might be the source of the white page problem.</p>
          </div>
        ) : (
          <div className="alert alert-success">
            <h4>✅ Data Loading Success</h4>
            <p>Data utilities are working correctly!</p>
          </div>
        )}

        <div className="row">
          <div className="col-md-6">
            <div className="card">
              <div className="card-header bg-primary text-white">
                <h3>🎮 Games Data</h3>
              </div>
              <div className="card-body">
                {gamesData ? (
                  <>
                    <p><strong>Total Games:</strong> {gamesData.length}</p>
                    <p><strong>Status:</strong> ✅ Loaded successfully</p>
                    {gamesData.length > 0 && (
                      <div>
                        <p><strong>Latest Game:</strong> {gamesData[gamesData.length - 1].gameDate}</p>
                        <p><strong>First Game:</strong> {gamesData[0].gameDate}</p>
                      </div>
                    )}
                  </>
                ) : (
                  <p>❌ Failed to load games data</p>
                )}
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="card">
              <div className="card-header bg-success text-white">
                <h3>🏆 Leaderboard Data</h3>
              </div>
              <div className="card-body">
                {leaderboardData ? (
                  <>
                    <p><strong>Total Players:</strong> {leaderboardData.players.length}</p>
                    <p><strong>Status:</strong> ✅ Loaded successfully</p>
                    {leaderboardData.players.length > 0 && (
                      <div>
                        <p><strong>Top Player:</strong> {leaderboardData.players[0].name}</p>
                        <p><strong>Top Score:</strong> {leaderboardData.players[0].cumulativeScore}</p>
                      </div>
                    )}
                  </>
                ) : (
                  <p>❌ Failed to load leaderboard data</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="row mt-4">
          <div className="col-md-12">
            <div className="card">
              <div className="card-header bg-info text-white">
                <h3>🔍 Debug Information</h3>
              </div>
              <div className="card-body">
                <p><strong>Step 1:</strong> ✅ React + Bootstrap working</p>
                <p><strong>Step 2:</strong> {dataError ? '❌' : '✅'} Data utilities {dataError ? 'failed' : 'working'}</p>
                <p><strong>Next Step:</strong> {dataError ? 'Fix data loading' : 'Add basic components'}</p>
                <p><strong>Console:</strong> Check browser console for detailed logs</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <footer className="bg-light text-center text-muted py-3 mt-4">
        <div className="container">
          <small>Partners Competition App - Step 2: Data Layer Testing</small>
        </div>
      </footer>
    </div>
  );
}

export default Step2App;