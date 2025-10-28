import React from 'react';
import { ResponsiveRadar } from '@nivo/radar';
import { getLeaderboardData, getGames } from '../utils/dataUtils';

const PlayerStrengthChart = () => {
  const { players } = getLeaderboardData();
  const games = getGames();
  
  // Prepare data for the radar chart
  // For each player, we'll calculate their average scores in different games
  
  // First, create categories for the radar chart (use game IDs)
  const gameIds = games.map(game => `Game ${game.gameId}`);
  
  // Next, prepare the data for each player
  const radarData = players.map(player => {
    const playerData = { player: player.name };
    
    // For each game, find the player's score
    games.forEach(game => {
      // Find which team the player was on
      const playerTeam = game.teams.find(team => 
        team.players.includes(player.name)
      );
      
      // Add the score to the player's data
      playerData[`Game ${game.gameId}`] = playerTeam ? playerTeam.score : 0;
    });
    
    return playerData;
  });

  return (
    <div className="card mb-4">
      <div className="card-header bg-purple text-white" style={{ backgroundColor: '#8A2BE2' }}>
        <h2>🎯 Player Strength Analysis</h2>
      </div>
      <div className="card-body">
        <div style={{ height: '400px' }}>
          <ResponsiveRadar
            data={radarData}
            keys={gameIds}
            indexBy="player"
            maxValue={3}
            margin={{ top: 70, right: 80, bottom: 40, left: 80 }}
            borderColor={{ from: 'color' }}
            gridLabelOffset={36}
            dotSize={10}
            dotColor={{ theme: 'background' }}
            dotBorderWidth={2}
            dotBorderColor={{ from: 'color' }}
            enableDotLabel={true}
            dotLabel="value"
            dotLabelYOffset={-12}
            colors={{ scheme: 'category10' }}
            blendMode="multiply"
            motionConfig="wobbly"
            legends={[
              {
                anchor: 'top-left',
                direction: 'column',
                translateX: -50,
                translateY: -40,
                itemWidth: 80,
                itemHeight: 20,
                itemTextColor: '#999',
                symbolSize: 12,
                symbolShape: 'circle',
                effects: [
                  {
                    on: 'hover',
                    style: {
                      itemTextColor: '#000'
                    }
                  }
                ]
              }
            ]}
          />
        </div>
      </div>
    </div>
  );
};

export default PlayerStrengthChart;
