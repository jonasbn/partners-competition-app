import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function StepByStepApp() {
  console.log('StepByStepApp is rendering...');

  return (
    <div className="App">
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
        <div className="container">
          <span className="navbar-brand">🏓 Partners Competition App</span>
        </div>
      </nav>
      
      <div className="container">
        <div className="alert alert-success">
          <h4>✅ Step 1: Basic React + Bootstrap</h4>
          <p>If you can see this, React and Bootstrap are working correctly.</p>
          <p><strong>Next:</strong> Add basic components one by one.</p>
        </div>

        <div className="row">
          <div className="col-md-12">
            <div className="card">
              <div className="card-header bg-primary text-white">
                <h2>🏆 Application Status</h2>
              </div>
              <div className="card-body">
                <p>React: ✅ Working</p>
                <p>Bootstrap: ✅ Working</p>
                <p>CSS: ✅ Working</p>
                <p>Console: Check browser console for any errors</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <footer className="bg-light text-center text-muted py-3 mt-4">
        <div className="container">
          <small>Partners Competition App - Step by Step Loading</small>
        </div>
      </footer>
    </div>
  );
}

export default StepByStepApp;