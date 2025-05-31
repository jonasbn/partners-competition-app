import React from 'react';
// Import the line chart component from nivo
import { ResponsiveLine } from '@nivo/line';
import { getGames } from '../utils/dataUtils';
import { useTranslation } from 'react-i18next';

const PlayerPerformanceChart = ({ t }) => {
  const { t: translate } = useTranslation();
  // Use provided t function if available, otherwise use local translate
  const tFunc = t || translate;
  const games = getGames();
  
  // Get all players from all games
  const allPlayers = [...new Set(games.flatMap(game => 
    game.teams.flatMap(team => team.players)
  ))];
  
  // Create a mapping of player scores over games
  const playerPerformance = allPlayers.map(player => {
    const data = games.map(game => {
      // Find the team containing this player
      const team = game.teams.find(team => team.players.includes(player));
      return {
        x: `Game ${game.gameId}`,
        y: team ? team.score : null
      };
    }).filter(point => point.y !== null); // Only include games where player participated
    
    return {
      id: player,
      data: data
    };
  }).filter(series => series.data.length > 0); // Only include players who participated in at least one game

  return (
    <div className="card mb-4">
      <div className="card-header bg-warning text-white">
        <h2>📈 {tFunc('charts.playerPerformance.title')}</h2>
      </div>
      <div className="card-body">
        <p className="text-muted">{tFunc('charts.playerPerformance.description')}</p>
        <div style={{ height: '400px' }}>
          <ResponsiveLine
            data={playerPerformance}
            margin={{ top: 40, right: 100, bottom: 40, left: 60 }}
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
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: tFunc('charts.playerPerformance.axisLabels.games'),
              legendOffset: 36,
              legendPosition: 'middle'
            }}
            axisLeft={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: tFunc('charts.playerPerformance.axisLabels.points'),
              legendOffset: -40,
              legendPosition: 'middle',
              tickValues: [1, 2, 3]
            }}
            colors={{ scheme: 'category10' }}
            pointSize={10}
            pointColor={{ theme: 'background' }}
            pointBorderWidth={2}
            pointBorderColor={{ from: 'serieColor' }}
            pointLabelYOffset={-12}
            useMesh={true}
            lineWidth={3}
            enableSlices="x"
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
        <div className="text-center mt-3">
          <small className="text-muted">
            This chart shows points earned by each player in each game.
            Players only appear in games they participated in.
          </small>
        </div>
      </div>
    </div>
  );
};

export default PlayerPerformanceChart;
