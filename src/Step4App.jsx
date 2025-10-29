import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function Step4App() {
  console.log('Step4App is rendering - testing Bootstrap integration');

  return (
    <div className="container-fluid">
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
        <div className="container">
          <span className="navbar-brand">🏓 Partners Competition App</span>
        </div>
      </nav>
      
      <div className="container">
        <div className="alert alert-success">
          <h4>✅ Step 4: Bootstrap Integration Test</h4>
          <p>Testing if Bootstrap CSS is causing issues...</p>
        </div>

        <div className="row">
          <div className="col-md-6">
            <div className="card">
              <div className="card-header bg-primary text-white">
                <h5>🧪 Bootstrap Components Test</h5>
              </div>
              <div className="card-body">
                <p>If you can see this styled card, Bootstrap is working!</p>
                <button className="btn btn-success me-2">Success Button</button>
                <button className="btn btn-warning">Warning Button</button>
              </div>
            </div>
          </div>
          
          <div className="col-md-6">
            <div className="card">
              <div className="card-header bg-info text-white">
                <h5>📊 Test Results</h5>
              </div>
              <div className="card-body">
                <ul className="list-group list-group-flush">
                  <li className="list-group-item">✅ React rendering</li>
                  <li className="list-group-item">✅ Bootstrap CSS loading</li>
                  <li className="list-group-item">✅ Grid system working</li>
                  <li className="list-group-item">✅ Card components</li>
                  <li className="list-group-item">✅ Button styling</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="row mt-4">
          <div className="col-12">
            <div className="alert alert-info">
              <h5>🔍 Next Steps if this works:</h5>
              <ol>
                <li><strong>Step 5:</strong> Add data utilities (getGames, getLeaderboardData)</li>
                <li><strong>Step 6:</strong> Add individual components one by one</li>
                <li><strong>Step 7:</strong> Identify the specific component causing the white page</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
      
      <footer className="bg-light text-center text-muted py-3 mt-4">
        <div className="container">
          <small>Partners Competition App - Step 4: Bootstrap Test</small>
        </div>
      </footer>
    </div>
  );
}

export default Step4App;