import React from 'react';
import './App.css';
import Leaderboard from './components/Leaderboard';
import GamesList from './components/GamesList';

function App() {
  return (
    <div className="App">
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
        <div className="container">
          <span className="navbar-brand">Partners Competition App</span>
        </div>
      </nav>
      
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <Leaderboard />
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
