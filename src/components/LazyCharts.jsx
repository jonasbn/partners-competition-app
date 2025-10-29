import React, { lazy, Suspense } from 'react';
import FallbackChart from './FallbackChart';
import ChartErrorBoundary from './ChartErrorBoundary';

// Temporarily use simple fallback components to resolve module loading issues
const PlayerStatsChart = lazy(() => import('./SimpleStatsChart'));
const PlayerPerformanceChart = lazy(() => import('./SimplePerformanceChart'));
const GamesCalendarChart = lazy(() => import('./SimpleCalendarChart'));
const TeamCombinationChart = lazy(() => import('./SimpleTeamChart'));
const PointsDistributionChart = lazy(() => import('./SimpleDistributionChart'));
const PlayerStrengthChart = lazy(() => import('./SimpleRadarChart'));

// Wrapper components with Suspense, fallback, and error boundaries
export const LazyPlayerStatsChart = (props) => (
  <ChartErrorBoundary chartName="Player Stats Chart">
    <Suspense fallback={<FallbackChart title="📊 Loading Player Stats..." message="Loading chart data..." />}>
      <PlayerStatsChart {...props} />
    </Suspense>
  </ChartErrorBoundary>
);

export const LazyPlayerPerformanceChart = (props) => (
  <ChartErrorBoundary chartName="Player Performance Chart">
    <Suspense fallback={<FallbackChart title="📈 Loading Performance..." message="Loading chart data..." />}>
      <PlayerPerformanceChart {...props} />
    </Suspense>
  </ChartErrorBoundary>
);

export const LazyGamesCalendarChart = (props) => (
  <ChartErrorBoundary chartName="Games Calendar Chart">
    <Suspense fallback={<FallbackChart title="📆 Loading Calendar..." message="Loading chart data..." />}>
      <GamesCalendarChart {...props} />
    </Suspense>
  </ChartErrorBoundary>
);

export const LazyTeamCombinationChart = (props) => (
  <ChartErrorBoundary chartName="Team Combination Chart">
    <Suspense fallback={<FallbackChart title="🤝 Loading Team Data..." message="Loading chart data..." />}>
      <TeamCombinationChart {...props} />
    </Suspense>
  </ChartErrorBoundary>
);

export const LazyPointsDistributionChart = (props) => (
  <ChartErrorBoundary chartName="Points Distribution Chart">
    <Suspense fallback={<FallbackChart title="🍩 Loading Distribution..." message="Loading chart data..." />}>
      <PointsDistributionChart {...props} />
    </Suspense>
  </ChartErrorBoundary>
);

export const LazyPlayerStrengthChart = (props) => (
  <ChartErrorBoundary chartName="Player Strength Chart">
    <Suspense fallback={<FallbackChart title="💪 Loading Strength..." message="Loading chart data..." />}>
      <PlayerStrengthChart {...props} />
    </Suspense>
  </ChartErrorBoundary>
);