import gamesData from '../data/games.json';

// Function to process the games data and calculate leaderboard
export const processGamesData = () => {
  // Initialize players with their data
  const players = [
    { id: 1, name: 'Jonas', cumulativeScore: 0, games: [] },
    { id: 2, name: 'Torben', cumulativeScore: 0, games: [] },
    { id: 3, name: 'Gitte', cumulativeScore: 0, games: [] },
    { id: 4, name: 'Anette', cumulativeScore: 0, games: [] },
    { id: 5, name: 'Lotte', cumulativeScore: 0, games: [] },
    { id: 6, name: 'Peter', cumulativeScore: 0, games: [] }
  ];

  // Process each game
  const processedGames = gamesData.map(game => {
    const processedGame = {
      gameId: game.gameId,
      gameDate: game.gameDate,
      teams: []
    };

    // Group players into teams based on their scores
    const scoreGroups = {};
    game.players.forEach(player => {
      if (!scoreGroups[player.score]) {
        scoreGroups[player.score] = [];
      }
      scoreGroups[player.score].push(player.name);
      
      // Update player's cumulative score
      const playerIndex = players.findIndex(p => p.name === player.name);
      if (playerIndex !== -1) {
        players[playerIndex].cumulativeScore += player.score;
        players[playerIndex].games.push({
          gameId: game.gameId,
          score: player.score
        });
      }
    });

    // Form teams based on score groups
    // In Partners, teams consist of 2 players with the same score
    Object.entries(scoreGroups).forEach(([score, playerNames]) => {
      // Teams have the same score and consist of 2 players
      for (let i = 0; i < playerNames.length; i += 2) {
        if (i + 1 < playerNames.length) {
          processedGame.teams.push({
            players: [playerNames[i], playerNames[i + 1]],
            score: parseInt(score, 10)
          });
        }
      }
    });

    return processedGame;
  });

  // Sort players by cumulative score (descending)
  players.sort((a, b) => b.cumulativeScore - a.cumulativeScore);

  return {
    players,
    games: processedGames
  };
};

// Get leaderboard data
export const getLeaderboardData = () => {
  return processGamesData();
};

// Get list of games
export const getGames = () => {
  return processGamesData().games;
};

// Get player details by ID
export const getPlayerById = (playerId) => {
  const players = processGamesData().players;
  return players.find(player => player.id === parseInt(playerId, 10));
};

// Calculate team statistics - find winning teams and their performance
export const getTeamStatistics = () => {
  const processedGames = processGamesData().games;
  const teamStats = {};
  
  // Process each game to find teams
  processedGames.forEach(game => {
    game.teams.forEach(team => {
      // Create a consistent team key by sorting player names alphabetically
      const teamKey = [...team.players].sort().join('-');
      
      // Initialize team stats if not already done
      if (!teamStats[teamKey]) {
        teamStats[teamKey] = {
          players: team.players,
          gamesPlayed: 0,
          wins: 0,        // score = 3
          seconds: 0,     // score = 2
          thirds: 0,      // score = 1
          totalPoints: 0,
          winRate: 0
        };
      }
      
      // Update team stats
      teamStats[teamKey].gamesPlayed += 1;
      teamStats[teamKey].totalPoints += team.score;
      
      // Update placement stats
      if (team.score === 3) {
        teamStats[teamKey].wins += 1;
      } else if (team.score === 2) {
        teamStats[teamKey].seconds += 1;
      } else if (team.score === 1) {
        teamStats[teamKey].thirds += 1;
      }
    });
  });
  
  // Calculate win rate for each team
  Object.values(teamStats).forEach(team => {
    team.winRate = team.gamesPlayed > 0 ? (team.wins / team.gamesPlayed) * 100 : 0;
  });
  
  // Convert to array and sort by wins, then by win rate
  const sortedTeams = Object.values(teamStats).sort((a, b) => {
    if (b.wins !== a.wins) return b.wins - a.wins;
    return b.winRate - a.winRate;
  });
  
  return sortedTeams;
};

// Calculate team combination statistics - shows how many times each possible team combination has played
export const getTeamCombinationStatistics = () => {
  const allPlayers = ['Jonas', 'Torben', 'Gitte', 'Anette', 'Lotte', 'Peter'];
  const processedGames = processGamesData().games;
  
  // Generate all possible team combinations (2 players each)
  const allPossibleTeams = [];
  for (let i = 0; i < allPlayers.length; i++) {
    for (let j = i + 1; j < allPlayers.length; j++) {
      const teamKey = [allPlayers[i], allPlayers[j]].sort().join(' & ');
      allPossibleTeams.push({
        teamKey,
        players: [allPlayers[i], allPlayers[j]],
        count: 0,
        lastPlayed: null
      });
    }
  }
  
  // Count actual team occurrences
  const teamCounts = {};
  processedGames.forEach(game => {
    game.teams.forEach(team => {
      const teamKey = [...team.players].sort().join(' & ');
      if (!teamCounts[teamKey]) {
        teamCounts[teamKey] = {
          count: 0,
          lastPlayed: null
        };
      }
      teamCounts[teamKey].count += 1;
      teamCounts[teamKey].lastPlayed = game.gameDate;
    });
  });
  
  // Update the possible teams with actual counts
  allPossibleTeams.forEach(team => {
    if (teamCounts[team.teamKey]) {
      team.count = teamCounts[team.teamKey].count;
      team.lastPlayed = teamCounts[team.teamKey].lastPlayed;
    }
  });
  
  // Sort by count (descending), then by team name
  allPossibleTeams.sort((a, b) => {
    if (b.count !== a.count) return b.count - a.count;
    return a.teamKey.localeCompare(b.teamKey);
  });
  
  return allPossibleTeams;
};

// Export as a single default object
const dataUtils = {
  getLeaderboardData,
  getGames,
  getPlayerById,
  getTeamStatistics,
  getTeamCombinationStatistics
};

export default dataUtils;
