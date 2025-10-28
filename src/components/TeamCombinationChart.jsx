import React from 'react';
import { ResponsiveBar } from '@nivo/bar';
import { getTeamCombinationStatistics } from '../utils/dataUtils';
import { useTranslation } from 'react-i18next';

const TeamCombinationChart = () => {
  const { t } = useTranslation();
  
  // Chart theme for dark mode compatibility
  const chartTheme = {
    background: 'transparent',
    text: {
      fontSize: 12,
      fill: 'var(--text-color)',
      outlineWidth: 0,
      outlineColor: 'transparent',
    },
    axis: {
      domain: {
        line: {
          stroke: 'var(--text-color)',
          strokeWidth: 1,
        },
      },
      legend: {
        text: {
          fontSize: 12,
          fill: 'var(--text-color)',
          outlineWidth: 0,
          outlineColor: 'transparent',
        },
      },
      ticks: {
        line: {
          stroke: 'var(--text-color)',
          strokeWidth: 1,
        },
        text: {
          fontSize: 11,
          fill: 'var(--text-color)',
          outlineWidth: 0,
          outlineColor: 'transparent',
        },
      },
    },
    grid: {
      line: {
        stroke: 'var(--text-color)',
        strokeWidth: 1,
        strokeOpacity: 0.1,
      },
    },
    legends: {
      text: {
        fontSize: 12,
        fill: 'var(--text-color)',
        outlineWidth: 0,
        outlineColor: 'transparent',
      },
    },
    tooltip: {
      container: {
        background: 'var(--card-bg)',
        color: 'var(--text-color)',
        fontSize: '12px',
        borderRadius: '4px',
        boxShadow: '0 1px 2px rgba(0,0,0,0.25)',
        border: '1px solid var(--card-border)',
      },
    },
  };

  try {
    const teamCombinationData = getTeamCombinationStatistics();
    
    // Transform data for Nivo Bar chart
    const chartData = teamCombinationData.map(team => ({
      team: team.teamKey,
      count: team.count,
      lastPlayed: team.lastPlayed,
      players: team.players
    }));

    // Custom tooltip component
    const CustomTooltip = ({ id, value, data }) => (
      <div style={{
        background: 'var(--card-bg)',
        color: 'var(--text-color)',
        padding: '9px 12px',
        border: '1px solid var(--card-border)',
        borderRadius: '4px',
        fontSize: '12px',
        boxShadow: '0 1px 2px rgba(0,0,0,0.25)'
      }}>
        <div><strong>{data.team}</strong></div>
        <div>{t('charts.teamCombinations.tooltip.gamesPlayed', { count: value })}</div>
        {data.lastPlayed ? (
          <div>{t('charts.teamCombinations.tooltip.lastPlayed', { date: data.lastPlayed })}</div>
        ) : (
          <div style={{ color: '#dc3545', fontStyle: 'italic' }}>
            {t('charts.teamCombinations.tooltip.neverPlayed')}
          </div>
        )}
      </div>
    );

    return (
      <div className="card">
        <div className="card-header bg-info text-white">
          <h2>🤝 {t('charts.teamCombinations.title')}</h2>
        </div>
        <div className="card-body">
          <p className="text-muted mb-4">
            {t('charts.teamCombinations.description')}
          </p>
          <div style={{ height: '600px' }}>
            <ResponsiveBar
              data={chartData}
              keys={['count']}
              indexBy="team"
              margin={{ top: 50, right: 130, bottom: 150, left: 80 }}
              padding={0.3}
              valueScale={{ type: 'linear' }}
              indexScale={{ type: 'band', round: true }}
              colors={(bar) => {
                // Color coding: red for 0 games, orange for 1-2 games, green for 3+ games
                if (bar.data.count === 0) return '#dc3545'; // Red for never played
                if (bar.data.count <= 2) return '#fd7e14'; // Orange for rarely played
                return '#28a745'; // Green for frequently played
              }}
              theme={chartTheme}
              borderColor={{
                from: 'color',
                modifiers: [['darker', 1.6]]
              }}
              axisTop={null}
              axisRight={null}
              axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: -45,
                legend: t('charts.teamCombinations.axisLabels.team'),
                legendPosition: 'middle',
                legendOffset: 120
              }}
              axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: t('charts.teamCombinations.axisLabels.games'),
                legendPosition: 'middle',
                legendOffset: -60
              }}
              enableGridY={true}
              enableGridX={false}
              labelSkipWidth={12}
              labelSkipHeight={12}
              labelTextColor={{
                from: 'color',
                modifiers: [['darker', 1.6]]
              }}
              tooltip={CustomTooltip}
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
              role="application"
              ariaLabel="Team combination statistics chart"
              barAriaLabel={e => `${e.id}: ${e.formattedValue} games played`}
            />
          </div>
          
          {/* Legend for color coding */}
          <div className="mt-3">
            <small className="text-muted">
              <strong>Color coding:</strong> 
              <span className="ms-2">
                <span style={{ color: '#dc3545' }}>●</span> Never played (0 games)
              </span>
              <span className="ms-3">
                <span style={{ color: '#fd7e14' }}>●</span> Rarely played (1-2 games)
              </span>
              <span className="ms-3">
                <span style={{ color: '#28a745' }}>●</span> Frequently played (3+ games)
              </span>
            </small>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error rendering team combination chart:', error);
    return (
      <div className="card">
        <div className="card-header bg-info text-white">
          <h2>🤝 {t('charts.teamCombinations.title')}</h2>
        </div>
        <div className="card-body">
          <div className="alert alert-warning" role="alert">
            <h4 className="alert-heading">{t('charts.unavailable.header')}</h4>
            <p className="mb-0">{t('charts.teamCombinations.unavailable')}</p>
          </div>
        </div>
      </div>
    );
  }
};

export default TeamCombinationChart;
