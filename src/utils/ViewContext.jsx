import React from 'react';
import PropTypes from 'prop-types';

export const VIEWS = { SEASON: 'season', TOURNAMENT: 'tournament' };

export const ViewContext = React.createContext();

export const ViewProvider = ({ children }) => {
  const [activeView, setActiveView] = React.useState(VIEWS.SEASON);

  return (
    <ViewContext.Provider value={{ activeView, setActiveView }}>
      {children}
    </ViewContext.Provider>
  );
};

ViewProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ViewProvider;
