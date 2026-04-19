import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider } from '../../utils/ThemeContext';
import { YearContext } from '../../utils/YearContext';
import '../../utils/i18n';
import YearSelector from '../../components/YearSelector';

const renderWithProviders = (component, contextValue) => {
  return render(
    <ThemeProvider>
      <YearContext.Provider value={contextValue}>
        {component}
      </YearContext.Provider>
    </ThemeProvider>
  );
};

const defaultContext = {
  selectedYear: 2026,
  setSelectedYear: vi.fn(),
  availableYears: [2025, 2026]
};

describe('YearSelector Component', () => {
  it('renders without crashing', () => {
    renderWithProviders(<YearSelector />, defaultContext);
    const group = document.querySelector('.btn-group');
    expect(group).toBeInTheDocument();
  });

  it('renders a button for each available year', () => {
    renderWithProviders(<YearSelector />, defaultContext);
    expect(screen.getByText('2025')).toBeInTheDocument();
    expect(screen.getByText('2026')).toBeInTheDocument();
  });

  it('highlights the selected year button', () => {
    renderWithProviders(<YearSelector />, defaultContext);
    const activeButton = screen.getByText('2026');
    expect(activeButton.className).toContain('btn-light');
    const inactiveButton = screen.getByText('2025');
    expect(inactiveButton.className).toContain('btn-outline-light');
  });

  it('calls setSelectedYear when a year button is clicked', () => {
    const setSelectedYear = vi.fn();
    renderWithProviders(<YearSelector />, { ...defaultContext, setSelectedYear });
    fireEvent.click(screen.getByText('2025'));
    expect(setSelectedYear).toHaveBeenCalledWith(2025);
  });
});
