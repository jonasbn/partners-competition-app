import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { getLeaderboardData } from './utils/dataUtils';
import FixedSimpleLeaderboard from './components/FixedSimpleLeaderboard';

function Step6AFixedApp() {
  console.log('Step6AFixedApp is rendering - testing FIXED SimpleLeaderboard component');

  let dataError = null;
  let leaderboardData = null;

  try {
    leaderboardData = getLeaderboardData();
    console.log('Leaderboard data loaded for fixed component test');
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
          <h4>🔧 Step 6A-Fixed: Fixed SimpleLeaderboard Component</h4>
          <p>Testing <strong>FIXED</strong> SimpleLeaderboard with proper error handling...</p>
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
              <div className="card-header bg-success text-white">
                <h5>🔧 Fixed Component Test Area</h5>
              </div>
              <div className="card-body">
                {(() => {
                  try {
                    console.log('Attempting to render FixedSimpleLeaderboard...');
                    return <FixedSimpleLeaderboard />;
                  } catch (error) {
                    console.error('FixedSimpleLeaderboard render error:', error);
                    return (
                      <div className="alert alert-danger">
                        <strong>❌ FixedSimpleLeaderboard Error:</strong> {error.message}
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
                <h5>🔧 Fix Summary</h5>
              </div>
              <div className="card-body">
                <h6>Issues Fixed:</h6>
                <ul className="small">
                  <li>✅ Added error handling</li>
                  <li>✅ Safe property access</li>
                  <li>✅ Division by zero protection</li>
                  <li>✅ Null/undefined checks</li>
                  <li>✅ Better logging</li>
                </ul>
                
                <div className="mt-3">
                  <h6>Test Results:</h6>
                  <ul className="small">
                    <li><strong>If works:</strong> Bug is fixed!</li>
                    <li><strong>If still breaks:</strong> Different issue</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            <div className="alert alert-info">
              <h5>🎯 Bug Analysis Complete:</h5>
              <p><strong>Root Cause Identified:</strong> SimpleLeaderboard component had unsafe property access and missing error handling.</p>
              <p><strong>If this works:</strong> We can fix the original SimpleLeaderboard and restore full functionality!</p>
            </div>
          </div>
        </div>
      </div>
      
      <footer className="bg-light text-center text-muted py-3 mt-4">
        <div className="container">
          <small>Partners Competition App - Step 6A-Fixed: Bug Fix Test</small>
        </div>
      </footer>
    </div>
  );
}

export default Step6AFixedApp;