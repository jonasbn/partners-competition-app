import React from 'react';
import { useTranslation } from 'react-i18next';
import { getTeamCombinationStatistics } from '../utils/dataUtils';

const SimpleTeamChart = () => {
  const { t } = useTranslation();
  
  try {
    const teamStats = getTeamCombinationStatistics();

    // Sort teams by games played
    const sortedTeams = teamStats.sort((a, b) => b.gamesPlayed - a.gamesPlayed);

    return (
      <div className="card mb-4">
        <div className="card-header bg-info text-white">
          <h2>🤝 {t('charts.teamCombinations.title') || 'Team Combinations'}</h2>
        </div>
        <div className="card-body">
          <div className="alert alert-info">
            <h4>👥 Team Partnership Analysis</h4>
            <p>Interactive charts are temporarily unavailable. Here's team combination data:</p>
          </div>

          <div className="row">
            {sortedTeams.slice(0, 6).map((team, index) => (
              <div key={team.team} className="col-md-6 col-lg-4 mb-3">
                <div className="card border-info">
                  <div className="card-body">
                    <h6 className="card-title">
                      {team.team}
                      {index === 0 && ' 🏆'}
                    </h6>
                    <div className="d-flex justify-content-between">
                      <div>
                        <div className="text-info h4">{team.gamesPlayed}</div>
                        <small>Games Played</small>
                      </div>
                      <div>
                        <div className="text-success h4">{team.wins}</div>
                        <small>Wins</small>
                      </div>
                    </div>
                    <div className="mt-2">
                      <div className="progress" style={{ height: '8px' }}>
                        <div 
                          className="progress-bar bg-success" 
                          role="progressbar" 
                          style={{ width: `${team.winRate}%` }}
                        ></div>
                      </div>
                      <small className="text-muted">Win Rate: {team.winRate.toFixed(1)}%</small>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {sortedTeams.length > 6 && (
            <div className="mt-3">
              <h6>All Team Combinations:</h6>
              <div className="table-responsive">
                <table className="table table-sm">
                  <thead>
                    <tr>
                      <th>Team</th>
                      <th>Games</th>
                      <th>Wins</th>
                      <th>Win Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedTeams.slice(6).map(team => (
                      <tr key={team.team}>
                        <td>{team.team}</td>
                        <td>{team.gamesPlayed}</td>
                        <td>{team.wins}</td>
                        <td>{team.winRate.toFixed(1)}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error in SimpleTeamChart:', error);
    return (
      <div className="card mb-4">
        <div className="card-header bg-info text-white">
          <h2>🤝 Team Combinations</h2>
        </div>
        <div className="card-body">
          <div className="alert alert-warning">
            <h4>Team Data Unavailable</h4>
            <p>Unable to load team combination statistics at this time.</p>
          </div>
        </div>
      </div>
    );
  }
};

export default SimpleTeamChart;