import tournamentData2026 from '../data/tournament_summer_2026.json';

export const TOURNAMENT_PLAYERS = [
  { id: 1, name: 'Jonas' },
  { id: 2, name: 'Torben' },
  { id: 3, name: 'Gitte' },
  { id: 4, name: 'Anette' },
  { id: 5, name: 'Lotte' },
  { id: 6, name: 'Peter' },
  { id: 7, name: 'Malene' },
  { id: 8, name: 'Kurt' },
];

const WINNING_SCORE = 2;

// Process the tournament games data and calculate leaderboard.
// Unlike the season's processGamesData, not every player appears in every
// game — players.findIndex below simply skips anyone who sat a game out.
export const processTournamentData = (gameData = tournamentData2026) => {
  const players = TOURNAMENT_PLAYERS.map(p => ({ ...p, cumulativeScore: 0, games: [] }));

  const processedGames = gameData.map(game => {
    const processedGame = {
      gameId: game.gameId,
      gameDate: game.gameDate,
      teams: []
    };

    const scoreGroups = {};
    game.players.forEach(player => {
      if (!scoreGroups[player.score]) {
        scoreGroups[player.score] = [];
      }
      scoreGroups[player.score].push(player.name);

      const playerIndex = players.findIndex(p => p.name === player.name);
      if (playerIndex !== -1) {
        players[playerIndex].cumulativeScore += player.score;
        players[playerIndex].games.push({
          gameId: game.gameId,
          score: player.score
        });
      }
    });

    // Teams have the same score and consist of 2 players (2 teams per game).
    Object.entries(scoreGroups).forEach(([score, playerNames]) => {
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

  players.forEach(player => {
    player.gamesPlayed = player.games.length;
    player.wins = player.games.filter(game => game.score === WINNING_SCORE).length;
    player.winRate = player.gamesPlayed > 0 ? (player.wins / player.gamesPlayed) * 100 : 0;
    player.avgScore = player.gamesPlayed > 0 ? (player.cumulativeScore / player.gamesPlayed) : 0;
  });

  players.sort((a, b) => b.cumulativeScore - a.cumulativeScore);

  return {
    players,
    games: processedGames
  };
};

export const getTournamentLeaderboardData = (gameData) => processTournamentData(gameData);

export const getTournamentGames = (gameData) => processTournamentData(gameData).games;

// Calculate team statistics — wins (score 2) vs losses (score 1). There is
// no 3rd place in the tournament format, so unlike getTeamStatistics in
// dataUtils.js this tracks only wins/losses, not wins/seconds/thirds.
export const getTournamentTeamStatistics = (gameData) => {
  const processedGames = processTournamentData(gameData).games;
  const teamStats = {};

  processedGames.forEach(game => {
    game.teams.forEach(team => {
      const teamKey = [...team.players].sort().join('-');

      if (!teamStats[teamKey]) {
        teamStats[teamKey] = {
          players: team.players,
          gamesPlayed: 0,
          wins: 0,
          losses: 0,
          totalPoints: 0,
          winRate: 0
        };
      }

      teamStats[teamKey].gamesPlayed += 1;
      teamStats[teamKey].totalPoints += team.score;

      if (team.score === WINNING_SCORE) {
        teamStats[teamKey].wins += 1;
      } else {
        teamStats[teamKey].losses += 1;
      }
    });
  });

  Object.values(teamStats).forEach(team => {
    team.winRate = team.gamesPlayed > 0 ? (team.wins / team.gamesPlayed) * 100 : 0;
  });

  return Object.values(teamStats).sort((a, b) => {
    if (b.wins !== a.wins) return b.wins - a.wins;
    return b.winRate - a.winRate;
  });
};

// Calculate team combination statistics across all 28 possible pairings
// among the 8 tournament players (C(8,2) = 28).
export const getTournamentTeamCombinationStatistics = (gameData) => {
  const allPlayers = TOURNAMENT_PLAYERS.map(p => p.name);
  const processedGames = processTournamentData(gameData).games;

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

  const teamCounts = {};
  processedGames.forEach(game => {
    game.teams.forEach(team => {
      const teamKey = [...team.players].sort().join(' & ');
      if (!teamCounts[teamKey]) {
        teamCounts[teamKey] = { count: 0, lastPlayed: null };
      }
      teamCounts[teamKey].count += 1;
      teamCounts[teamKey].lastPlayed = game.gameDate;
    });
  });

  allPossibleTeams.forEach(team => {
    if (teamCounts[team.teamKey]) {
      team.count = teamCounts[team.teamKey].count;
      team.lastPlayed = teamCounts[team.teamKey].lastPlayed;
    }
  });

  allPossibleTeams.sort((a, b) => {
    if (b.count !== a.count) return b.count - a.count;
    return a.teamKey.localeCompare(b.teamKey);
  });

  return allPossibleTeams;
};

const tournamentUtils = {
  TOURNAMENT_PLAYERS,
  getTournamentLeaderboardData,
  getTournamentGames,
  getTournamentTeamStatistics,
  getTournamentTeamCombinationStatistics
};

export default tournamentUtils;
