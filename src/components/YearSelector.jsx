import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { YearContext } from '../utils/YearContext';

const YearSelector = () => {
  const { t } = useTranslation();
  const { selectedYear, setSelectedYear, availableYears } = useContext(YearContext);

  return (
    <div className="year-selector me-2">
      <div className="btn-group btn-group-sm" role="group" aria-label={t('yearSelector.label')}>
        {availableYears.map(year => (
          <button
            key={year}
            type="button"
            className={`btn ${selectedYear === year ? 'btn-light' : 'btn-outline-light'}`}
            onClick={() => setSelectedYear(year)}
            title={String(year)}
          >
            {year}
          </button>
        ))}
      </div>
    </div>
  );
};

export default YearSelector;
