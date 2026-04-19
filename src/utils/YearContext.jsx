import React from 'react';

export const AVAILABLE_YEARS = [2025, 2026];
export const MOST_RECENT_YEAR = Math.max(...AVAILABLE_YEARS);

export const YearContext = React.createContext();

export const YearProvider = ({ children }) => {
  const [selectedYear, setSelectedYear] = React.useState(MOST_RECENT_YEAR);

  return (
    <YearContext.Provider value={{ selectedYear, setSelectedYear, availableYears: AVAILABLE_YEARS }}>
      {children}
    </YearContext.Provider>
  );
};

export default YearProvider;
