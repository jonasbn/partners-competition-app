import React, { lazy, Suspense } from 'react';
import FallbackChart from './FallbackChart';

// Lazy load chart components to reduce initial bundle size
const PlayerStatsChart = lazy(() => import('./PlayerStatsChart'));
const PlayerPerformanceChart = lazy(() => import('./PlayerPerformanceChart'));
const GamesCalendarChart = lazy(() => import('./GamesCalendarChart'));
const TeamCombinationChart = lazy(() => import('./TeamCombinationChart'));
const PointsDistributionChart = lazy(() => import('./PointsDistributionChart'));
const PlayerStrengthChart = lazy(() => import('./PlayerStrengthChart'));

// Wrapper components with Suspense and fallback
export const LazyPlayerStatsChart = (props) => (
  <Suspense fallback={<FallbackChart title="📊 Loading Player Stats..." message="Loading chart data..." />}>
    <PlayerStatsChart {...props} />
  </Suspense>
);

export const LazyPlayerPerformanceChart = (props) => (
  <Suspense fallback={<FallbackChart title="📈 Loading Performance..." message="Loading chart data..." />}>
    <PlayerPerformanceChart {...props} />
  </Suspense>
);

export const LazyGamesCalendarChart = (props) => (
  <Suspense fallback={<FallbackChart title="📆 Loading Calendar..." message="Loading chart data..." />}>
    <GamesCalendarChart {...props} />
  </Suspense>
);

export const LazyTeamCombinationChart = (props) => (
  <Suspense fallback={<FallbackChart title="🤝 Loading Team Data..." message="Loading chart data..." />}>
    <TeamCombinationChart {...props} />
  </Suspense>
);

export const LazyPointsDistributionChart = (props) => (
  <Suspense fallback={<FallbackChart title="🍩 Loading Distribution..." message="Loading chart data..." />}>
    <PointsDistributionChart {...props} />
  </Suspense>
);

export const LazyPlayerStrengthChart = (props) => (
  <Suspense fallback={<FallbackChart title="💪 Loading Strength..." message="Loading chart data..." />}>
    <PlayerStrengthChart {...props} />
  </Suspense>
);