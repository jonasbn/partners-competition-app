import React from 'react';
// Modified import to ensure compatibility
import { ResponsiveBar } from '@nivo/bar';
import { getLeaderboardData } from '../utils/dataUtils';

const PlayerStatsChart = () => {
  const { players } = getLeaderboardData();
  
  // Prepare data for the chart
  const chartData = players.map(player => ({
    player: player.name,
    score: player.cumulativeScore,
    color: `hsl(${Math.floor(Math.random() * 360)}, 70%, 50%)`,
  }));

  return (
    <div className="card mb-4">
      <div className="card-header bg-info text-white">
        <h2>📊 Player Statistics</h2>
      </div>
      <div className="card-body">
        <div style={{ height: '400px' }}>
          <ResponsiveBar
            data={chartData}
            keys={['score']}
            indexBy="player"
            margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
            padding={0.3}
            valueScale={{ type: 'linear' }}
            indexScale={{ type: 'band', round: true }}
            colors={({ data }) => data.color}
            borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
            axisTop={null}
            axisRight={null}
            axisBottom={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: 'Player',
              legendPosition: 'middle',
              legendOffset: 32
            }}
            axisLeft={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: 'Score',
              legendPosition: 'middle',
              legendOffset: -40
            }}
            labelSkipWidth={12}
            labelSkipHeight={12}
            labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
            legends={[
              {
                dataFrom: 'keys',
                anchor: 'bottom-right',
                direction: 'column',
                justify: false,
                translateX: 120,
                translateY: 0,
                itemsSpacing: 2,
                itemWidth: 100,
                itemHeight: 20,
                itemDirection: 'left-to-right',
                itemOpacity: 0.85,
                symbolSize: 20,
                effects: [
                  {
                    on: 'hover',
                    style: {
                      itemOpacity: 1
                    }
                  }
                ]
              }
            ]}
            animate={true}
            motionStiffness={90}
            motionDamping={15}
          />
        </div>
      </div>
    </div>
  );
};

export default PlayerStatsChart;
