// Test script to verify getTeamCombinationStatistics function
const fs = require('fs');
const path = require('path');

// Mock the games data similar to what the app uses
const mockGamesData = [
  {
    gameId: 1,
    gameDate: "2024-01-15",
    players: [
      { name: "Jonas", score: 3 },
      { name: "Torben", score: 3 },
      { name: "Gitte", score: 2 },
      { name: "Anette", score: 2 },
      { name: "Lotte", score: 1 },
      { name: "Peter", score: 1 }
    ]
  },
  {
    gameId: 2,
    gameDate: "2024-01-20",
    players: [
      { name: "Jonas", score: 2 },
      { name: "Gitte", score: 2 },
      { name: "Torben", score: 1 },
      { name: "Anette", score: 1 },
      { name: "Lotte", score: 3 },
      { name: "Peter", score: 3 }
    ]
  }
];

// Simulate the team combination statistics function
function getTeamCombinationStatistics() {
  const allPlayers = ['Jonas', 'Torben', 'Gitte', 'Anette', 'Lotte', 'Peter'];
  
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
  
  // Count actual team occurrences from mock data
  const teamCounts = {};
  mockGamesData.forEach(game => {
    // Group players by score to form teams
    const scoreGroups = {};
    game.players.forEach(player => {
      if (!scoreGroups[player.score]) {
        scoreGroups[player.score] = [];
      }
      scoreGroups[player.score].push(player.name);
    });
    
    // Form teams from score groups
    Object.values(scoreGroups).forEach(players => {
      for (let i = 0; i < players.length; i += 2) {
        if (i + 1 < players.length) {
          const teamKey = [players[i], players[i + 1]].sort().join(' & ');
          if (!teamCounts[teamKey]) {
            teamCounts[teamKey] = {
              count: 0,
              lastPlayed: null
            };
          }
          teamCounts[teamKey].count += 1;
          teamCounts[teamKey].lastPlayed = game.gameDate;
        }
      }
    });
  });
  
  // Update teams with actual counts
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
}

// Test the function
const result = getTeamCombinationStatistics();
console.log("Team Combination Statistics:");
console.log("Total possible combinations:", result.length);
console.log("\nFirst 10 teams (sorted by frequency):");
result.slice(0, 10).forEach((team, index) => {
  console.log(`${index + 1}. ${team.teamKey}: ${team.count} games ${team.lastPlayed ? `(last: ${team.lastPlayed})` : '(never played)'}`);
});

console.log("\nTeams that have never played together:");
const neverPlayed = result.filter(team => team.count === 0);
console.log(`Count: ${neverPlayed.length}`);
neverPlayed.slice(0, 5).forEach(team => {
  console.log(`- ${team.teamKey}`);
});
