import React from 'react';
import { getLeaderboardData, getGames, getTeamStatistics } from '../utils/dataUtils';
import { getAvatarColor, getInitials } from '../utils/avatarUtils';
import { useTranslation } from 'react-i18next';

const SummaryCards = () => {
  const { t } = useTranslation();
  const { players } = getLeaderboardData();
  const games = getGames();
  const teamStats = getTeamStatistics();
  
  // Get the leading player (first in the sorted players array)
  const leadingPlayer = players.length > 0 ? players[0] : null;
  
  // Calculate the maximum possible score
  // Each game has 3 points for 1st place, 2 points for 2nd place, and 1 point for 3rd place
  // Maximum possible score is if a player got 3 points in every game
  const totalGames = games.length;
  const maxPossibleScore = totalGames * 3;
  
  // Calculate the percentage of maximum possible score
  const scorePercentage = leadingPlayer ? Math.round((leadingPlayer.cumulativeScore / maxPossibleScore) * 100) : 0;
  
  // Get the most winning team (first in the sorted teamStats array)
  const mostWinningTeam = teamStats.length > 0 ? teamStats[0] : null;
  
  // Calculate the number of possible team combinations
  // In a game with 6 players (3 teams of 2), the number of possible teams is 6C2 = 15
  const totalPlayers = players.length;
  const possibleTeamCombinations = totalPlayers * (totalPlayers - 1) / 2;
  
  // Calculate how many games are required for all players to have teamed up with each other
  const calculateRequiredGames = () => {
    // Get the teams that have already been formed in past games
    const formedTeams = new Set();
    games.forEach(game => {
      game.teams.forEach(team => {
        // Sort the players to ensure consistent team key
        const teamKey = [...team.players].sort().join('-');
        formedTeams.add(teamKey);
      });
    });
    
    // Get all possible player combinations
    const allPossibleTeams = [];
    for (let i = 0; i < players.length; i++) {
      for (let j = i + 1; j < players.length; j++) {
        const team = [players[i].name, players[j].name].sort().join('-');
        allPossibleTeams.push(team);
      }
    }
    
    // Count how many unique teams still need to be formed
    const remainingTeams = allPossibleTeams.filter(team => !formedTeams.has(team));
    
    // In each game with 6 players, we form 3 new teams
    // However, we can't guarantee that all new games will form previously unformed teams
    // A reasonable estimation is that we need at least ceil(remainingTeams / 3) more games
    const gamesNeeded = Math.ceil(remainingTeams.length / 3);
    
    return {
      totalGamesNeeded: Math.ceil(possibleTeamCombinations / 3),
      gamesPlayed: games.length,
      gamesRemaining: gamesNeeded,
      teamsFormed: formedTeams.size,
      teamsRemaining: remainingTeams.length,
      possibleTeams: possibleTeamCombinations
    };
  };
  
  const teamCoverage = calculateRequiredGames();
  
  // Style for the avatar circle
  const avatarStyle = (name) => ({
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    backgroundColor: getAvatarColor(name),
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    fontSize: '1.5rem',
    margin: '0 auto 1rem auto'
  });

  return (
    <div className="row mb-4">
      {/* Card 1: Leading Player */}
      <div className="col-md-4 mb-3">
        <div className="card h-100 border-warning">
          <div className="card-header bg-warning text-white">
            <h3 className="m-0">{t('summary.leadingPlayer.title')}</h3>
          </div>
          <div className="card-body text-center">
            {leadingPlayer && (
              <>
                <div style={avatarStyle(leadingPlayer.name)} className="avatar">
                  {getInitials(leadingPlayer.name)}
                </div>
                <h4 className="card-title">{leadingPlayer.name}</h4>
                <p className="card-text">
                  {t('summary.leadingPlayer.score')}: <strong>{leadingPlayer.cumulativeScore}</strong> / {maxPossibleScore}
                </p>
                <div className="progress mb-3">
                  <div 
                    className="progress-bar bg-warning" 
                    role="progressbar" 
                    style={{ width: `${scorePercentage}%` }} 
                    aria-valuenow={scorePercentage} 
                    aria-valuemin="0" 
                    aria-valuemax="100"
                  >
                    {scorePercentage}%
                  </div>
                </div>
                <p className="text-muted">
                  {t('summary.leadingPlayer.maxScore', { score: maxPossibleScore, games: totalGames })}
                </p>
              </>
            )}
          </div>
        </div>
      </div>
      
      {/* Card 2: Most Winning Team */}
      <div className="col-md-4 mb-3">
        <div className="card h-100 border-primary">
          <div className="card-header bg-primary text-white">
            <h3 className="m-0">{t('summary.mostWinningTeam.title')}</h3>
          </div>
          <div className="card-body text-center">
            {mostWinningTeam && (
              <>
                <div className="d-flex justify-content-center mb-3">
                  {mostWinningTeam.players.map((playerName, index) => (
                    <div key={index} className="position-relative" style={{ marginLeft: index > 0 ? '-15px' : '0' }}>
                      <div 
                        style={{
                          ...avatarStyle(playerName), 
                          width: '50px', 
                          height: '50px', 
                          fontSize: '1.2rem',
                          border: '2px solid white',
                          zIndex: 2 - index
                        }} 
                        className="avatar"
                      >
                        {getInitials(playerName)}
                      </div>
                    </div>
                  ))}
                </div>
                <h4 className="card-title">{mostWinningTeam.players.join(' & ')}</h4>
                <p className="card-text">
                  {t('summary.mostWinningTeam.stats', { 
                    wins: mostWinningTeam.wins, 
                    games: mostWinningTeam.gamesPlayed, 
                    rate: Math.round(mostWinningTeam.winRate) 
                  })}
                </p>
                <div className="progress mb-3">
                  <div 
                    className="progress-bar bg-primary" 
                    role="progressbar" 
                    style={{ width: `${mostWinningTeam.winRate}%` }} 
                    aria-valuenow={mostWinningTeam.winRate} 
                    aria-valuemin="0" 
                    aria-valuemax="100"
                  >
                    {Math.round(mostWinningTeam.winRate)}%
                  </div>
                </div>
                <p className="text-muted">
                  {t('summary.mostWinningTeam.combinations', { count: possibleTeamCombinations })}
                </p>
              </>
            )}
          </div>
        </div>
      </div>
      
      {/* Card 3: Team Coverage */}
      <div className="col-md-4 mb-3">
        <div className="card h-100 border-success">
          <div className="card-header bg-success text-white">
            <h3 className="m-0">{t('summary.teamCoverage.title')}</h3>
          </div>
          <div className="card-body text-center">
            <div className="display-1 mb-3">
              {teamCoverage.teamsFormed}/{teamCoverage.possibleTeams}
            </div>
            <p className="card-text">
              {t('summary.teamCoverage.formed', { 
                formed: teamCoverage.teamsFormed, 
                total: teamCoverage.possibleTeams 
              })}
            </p>
            <div className="progress mb-3">
              <div 
                className="progress-bar bg-success" 
                role="progressbar" 
                style={{ width: `${(teamCoverage.teamsFormed / teamCoverage.possibleTeams) * 100}%` }} 
                aria-valuenow={(teamCoverage.teamsFormed / teamCoverage.possibleTeams) * 100} 
                aria-valuemin="0" 
                aria-valuemax="100"
              >
                {Math.round((teamCoverage.teamsFormed / teamCoverage.possibleTeams) * 100)}%
              </div>
            </div>
            <p className="text-muted">
              {t('summary.teamCoverage.remaining', { 
                games: teamCoverage.gamesRemaining,
                teams: teamCoverage.teamsRemaining
              })}
            </p>
            <div className="small text-muted mt-3">
              {t('summary.teamCoverage.minimum', { games: teamCoverage.totalGamesNeeded })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryCards;
