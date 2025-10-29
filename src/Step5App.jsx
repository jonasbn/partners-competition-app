import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { getGames, getLeaderboardData } from './utils/dataUtils';

function Step5App() {
  console.log('Step5App is rendering - testing data utilities');

  let gamesData = null;
  let leaderboardData = null;
  let dataError = null;

  try {
    console.log('Loading games data...');
    gamesData = getGames();
    console.log('Games data loaded:', gamesData?.length, 'games');
    
    console.log('Loading leaderboard data...');
    leaderboardData = getLeaderboardData();
    console.log('Leaderboard data loaded:', leaderboardData?.players?.length, 'players');
  } catch (error) {
    dataError = error.message;
    console.error('Data loading error:', error);
  }

  return (
    <div className="container-fluid">
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
        <div className="container">
          <span className="navbar-brand">🏓 Partners Competition App</span>
        </div>
      </nav>
      
      <div className="container">
        <div className="alert alert-success">
          <h4>✅ Step 5: Data Utilities Test</h4>
          <p>Testing if data loading utilities are causing issues...</p>
        </div>

        {dataError && (
          <div className="alert alert-danger">
            <h4>❌ Data Error</h4>
            <p><strong>Error:</strong> {dataError}</p>
          </div>
        )}

        <div className="row">
          <div className="col-md-6">
            <div className="card">
              <div className="card-header bg-primary text-white">
                <h5>📊 Games Data</h5>
              </div>
              <div className="card-body">
                {gamesData ? (
                  <div>
                    <p><strong>✅ Games loaded successfully!</strong></p>
                    <ul>
                      <li><strong>Total games:</strong> {gamesData.length}</li>
                      <li><strong>First game date:</strong> {gamesData[0]?.gameDate}</li>
                      <li><strong>Last game date:</strong> {gamesData[gamesData.length - 1]?.gameDate}</li>
                    </ul>
                  </div>
                ) : (
                  <p className="text-danger">❌ Games data failed to load</p>
                )}
              </div>
            </div>
          </div>
          
          <div className="col-md-6">
            <div className="card">
              <div className="card-header bg-info text-white">
                <h5>🏆 Leaderboard Data</h5>
              </div>
              <div className="card-body">
                {leaderboardData ? (
                  <div>
                    <p><strong>✅ Leaderboard loaded successfully!</strong></p>
                    <ul>
                      <li><strong>Total players:</strong> {leaderboardData.players?.length}</li>
                      <li><strong>Leader:</strong> {leaderboardData.players?.[0]?.name}</li>
                      <li><strong>Leader score:</strong> {leaderboardData.players?.[0]?.cumulativeScore}</li>
                    </ul>
                  </div>
                ) : (
                  <p className="text-danger">❌ Leaderboard data failed to load</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="row mt-4">
          <div className="col-12">
            <div className="alert alert-info">
              <h5>🔍 Next Steps if this works:</h5>
              <ol>
                <li><strong>Step 6A:</strong> Add SimpleLeaderboard component only</li>
                <li><strong>Step 6B:</strong> Add SimpleGamesList component only</li>
                <li><strong>Step 6C:</strong> Add both components together</li>
                <li><strong>Conclusion:</strong> Identify which component breaks the app</li>
              </ol>
            </div>
          </div>
        </div>

        <div className="row mt-4">
          <div className="col-12">
            <div className="card">
              <div className="card-header bg-success text-white">
                <h5>📈 Progress Summary</h5>
              </div>
              <div className="card-body">
                <ul className="list-group list-group-flush">
                  <li className="list-group-item">✅ Step 0: Pure React</li>
                  <li className="list-group-item">✅ Step 4: React + Bootstrap</li>
                  <li className="list-group-item">🧪 Step 5: Data utilities (testing now)</li>
                  <li className="list-group-item">⏳ Step 6: Individual components</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <footer className="bg-light text-center text-muted py-3 mt-4">
        <div className="container">
          <small>Partners Competition App - Step 5: Data Utilities Test</small>
        </div>
      </footer>
    </div>
  );
}

export default Step5App;