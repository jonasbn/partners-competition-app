import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider } from '../../utils/ThemeContext';
import { ViewContext, VIEWS } from '../../utils/ViewContext';
import '../../utils/i18n';
import ViewSelector from '../../components/ViewSelector';

const renderWithProviders = (component, contextValue) => {
  return render(
    <ThemeProvider>
      <ViewContext.Provider value={contextValue}>
        {component}
      </ViewContext.Provider>
    </ThemeProvider>
  );
};

const defaultContext = {
  activeView: VIEWS.SEASON,
  setActiveView: vi.fn()
};

describe('ViewSelector Component', () => {
  it('renders without crashing', () => {
    renderWithProviders(<ViewSelector />, defaultContext);
    const group = document.querySelector('.btn-group');
    expect(group).toBeInTheDocument();
  });

  it('renders a button for each view', () => {
    renderWithProviders(<ViewSelector />, defaultContext);
    expect(screen.getByText('Sæson')).toBeInTheDocument();
    expect(screen.getByText('Sommerturnering')).toBeInTheDocument();
  });

  it('highlights the active view button', () => {
    renderWithProviders(<ViewSelector />, defaultContext);
    const activeButton = screen.getByText('Sæson');
    expect(activeButton.className).toContain('btn-light');
    const inactiveButton = screen.getByText('Sommerturnering');
    expect(inactiveButton.className).toContain('btn-outline-light');
  });

  it('calls setActiveView with "tournament" when the tournament button is clicked', () => {
    const setActiveView = vi.fn();
    renderWithProviders(<ViewSelector />, { ...defaultContext, setActiveView });
    fireEvent.click(screen.getByText('Sommerturnering'));
    expect(setActiveView).toHaveBeenCalledWith(VIEWS.TOURNAMENT);
  });
});
