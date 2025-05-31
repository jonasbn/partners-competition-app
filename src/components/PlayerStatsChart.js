import React from 'react';
// Import the bar chart component from nivo
import { ResponsiveBar } from '@nivo/bar';
import { getLeaderboardData } from '../utils/dataUtils';
import { useTranslation } from 'react-i18next';

const PlayerStatsChart = ({ t }) => {
  const { t: translate } = useTranslation();
  // Use provided t function if available, otherwise use local translate
  const tFunc = t || translate;
  const { players } = getLeaderboardData();
  
  // Prepare data for the chart
  const chartData = players.map(player => ({
    player: player.name,
    score: player.cumulativeScore,
    color: `hsl(${Math.floor(Math.random() * 360)}, 70%, 50%)`,
  }));

  // Define theme for chart based on current app theme
  const chartTheme = {
    axis: {
      ticks: {
        text: {
          fill: 'var(--text-color)'
        }
      },
      legend: {
        text: {
          fill: 'var(--text-color)'
        }
      }
    },
    legends: {
      text: {
        fill: 'var(--text-color)'
      }
    },
    tooltip: {
      container: {
        background: 'var(--card-bg)',
        color: 'var(--text-color)',
        boxShadow: '0 3px 9px rgba(0, 0, 0, 0.5)'
      }
    }
  };

  return (
    <div className="card mb-4">
      <div className="card-header bg-info text-white">
        <h2>📊 {tFunc('charts.playerStats.title')}</h2>
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
              legend: tFunc('charts.playerStats.axisLabels.player'),
              legendPosition: 'middle',
              legendOffset: 32
            }}
            axisLeft={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: tFunc('charts.playerStats.axisLabels.score'),
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
            tooltip={({ indexValue, value }) => (
              <div
                style={{
                  padding: 12,
                  background: 'var(--card-bg)',
                  borderRadius: 4,
                  boxShadow: '0 3px 8px rgba(0, 0, 0, 0.15)',
                  color: 'var(--text-color)'
                }}
              >
                <strong>{indexValue}</strong>
                <div>{tFunc('charts.playerStats.tooltip.score', { score: value })}</div>
              </div>
            )}
            theme={chartTheme}
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
