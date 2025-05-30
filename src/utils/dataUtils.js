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

// Export as a single default object
const dataUtils = {
  getLeaderboardData,
  getGames,
  getPlayerById
};

export default dataUtils;
