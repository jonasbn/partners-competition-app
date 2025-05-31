import React from 'react';
// Modified import to ensure compatibility
import { ResponsiveLine } from '@nivo/line';
import { getGames } from '../utils/dataUtils';

const PlayerPerformanceChart = () => {
  const games = getGames();
  
  // Get all players from the first game
  const allPlayers = [...new Set(games.flatMap(game => 
    game.teams.flatMap(team => team.players)
  ))];
  
  // Create a mapping of player performances over games
  const playerPerformance = allPlayers.map(player => {
    const data = games.map(game => {
      // Find the team containing this player
      const team = game.teams.find(team => team.players.includes(player));
      return {
        x: `Game ${game.gameId}`,
        y: team ? team.score : 0
      };
    });
    
    return {
      id: player,
      data: data
    };
  });

  return (
    <div className="card mb-4">
      <div className="card-header bg-warning text-white">
        <h2>📈 Player Performance Over Time</h2>
      </div>
      <div className="card-body">
        <div style={{ height: '400px' }}>
          <ResponsiveLine
            data={playerPerformance}
            margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
            xScale={{ type: 'point' }}
            yScale={{ 
              type: 'linear', 
              min: 0, 
              max: 3.5, 
              stacked: false, 
              reverse: false 
            }}
            axisTop={null}
            axisRight={null}
            axisBottom={{
              orient: 'bottom',
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: 'Games',
              legendOffset: 36,
              legendPosition: 'middle'
            }}
            axisLeft={{
              orient: 'left',
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: 'Points',
              legendOffset: -40,
              legendPosition: 'middle'
            }}
            colors={{ scheme: 'category10' }}
            pointSize={10}
            pointColor={{ theme: 'background' }}
            pointBorderWidth={2}
            pointBorderColor={{ from: 'serieColor' }}
            pointLabelYOffset={-12}
            useMesh={true}
            legends={[
              {
                anchor: 'bottom-right',
                direction: 'column',
                justify: false,
                translateX: 100,
                translateY: 0,
                itemsSpacing: 0,
                itemDirection: 'left-to-right',
                itemWidth: 80,
                itemHeight: 20,
                itemOpacity: 0.75,
                symbolSize: 12,
                symbolShape: 'circle',
                symbolBorderColor: 'rgba(0, 0, 0, .5)',
                effects: [
                  {
                    on: 'hover',
                    style: {
                      itemBackground: 'rgba(0, 0, 0, .03)',
                      itemOpacity: 1
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

export default PlayerPerformanceChart;
