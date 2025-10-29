import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { getLeaderboardData } from './utils/dataUtils';
import SimpleLeaderboard from './components/SimpleLeaderboard';

function Step6AApp() {
  console.log('Step6AApp is rendering - testing SimpleLeaderboard component only');

  let dataError = null;
  let leaderboardData = null;

  try {
    leaderboardData = getLeaderboardData();
    console.log('Leaderboard data loaded for component test');
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
        <div className="alert alert-warning">
          <h4>🧪 Step 6A: SimpleLeaderboard Component Test</h4>
          <p>Testing <strong>ONLY</strong> the SimpleLeaderboard component...</p>
        </div>

        {dataError && (
          <div className="alert alert-danger">
            <h4>❌ Data Error</h4>
            <p><strong>Error:</strong> {dataError}</p>
          </div>
        )}

        <div className="row">
          <div className="col-md-8">
            <div className="card mb-4">
              <div className="card-header bg-warning text-dark">
                <h5>🧪 Component Test Area</h5>
              </div>
              <div className="card-body">
                {(() => {
                  try {
                    console.log('Attempting to render SimpleLeaderboard...');
                    return <SimpleLeaderboard />;
                  } catch (error) {
                    console.error('SimpleLeaderboard render error:', error);
                    return (
                      <div className="alert alert-danger">
                        <strong>❌ SimpleLeaderboard Error:</strong> {error.message}
                        <br />
                        <small>Check console for full error details</small>
                      </div>
                    );
                  }
                })()}
              </div>
            </div>
          </div>
          
          <div className="col-md-4">
            <div className="card">
              <div className="card-header bg-info text-white">
                <h5>📊 Test Status</h5>
              </div>
              <div className="card-body">
                <ul className="list-group list-group-flush">
                  <li className="list-group-item">✅ React</li>
                  <li className="list-group-item">✅ Bootstrap</li>
                  <li className="list-group-item">✅ Data utilities</li>
                  <li className="list-group-item">🧪 SimpleLeaderboard</li>
                </ul>
                
                <div className="mt-3">
                  <h6>Expected Results:</h6>
                  <ul className="small">
                    <li><strong>If works:</strong> Component is fine</li>
                    <li><strong>If white page:</strong> SimpleLeaderboard has issues</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            <div className="alert alert-info">
              <h5>🔍 Testing Strategy:</h5>
              <ol>
                <li><strong>Step 6A:</strong> SimpleLeaderboard only (current)</li>
                <li><strong>Step 6B:</strong> SimpleGamesList only (if 6A works)</li>
                <li><strong>Step 6C:</strong> Both components (if both work individually)</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
      
      <footer className="bg-light text-center text-muted py-3 mt-4">
        <div className="container">
          <small>Partners Competition App - Step 6A: SimpleLeaderboard Test</small>
        </div>
      </footer>
    </div>
  );
}

export default Step6AApp;