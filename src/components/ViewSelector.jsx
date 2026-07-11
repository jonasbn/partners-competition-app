import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { ViewContext, VIEWS } from '../utils/ViewContext';

const ViewSelector = () => {
  const { t } = useTranslation();
  const { activeView, setActiveView } = useContext(ViewContext);

  return (
    <div className="view-selector me-2">
      <div className="btn-group btn-group-sm" role="group" aria-label={t('nav.label')}>
        <button
          type="button"
          className={`btn ${activeView === VIEWS.SEASON ? 'btn-light' : 'btn-outline-light'}`}
          onClick={() => setActiveView(VIEWS.SEASON)}
        >
          {t('nav.season')}
        </button>
        <button
          type="button"
          className={`btn ${activeView === VIEWS.TOURNAMENT ? 'btn-light' : 'btn-outline-light'}`}
          onClick={() => setActiveView(VIEWS.TOURNAMENT)}
        >
          {t('nav.tournament')}
        </button>
      </div>
    </div>
  );
};

export default ViewSelector;
