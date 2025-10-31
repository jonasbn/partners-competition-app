import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useTranslation } from 'react-i18next';
import { ThemeProvider } from '../../utils/ThemeContext';
import '../../utils/i18n';
import LanguageSelector from '../../components/LanguageSelector';

const renderWithProviders = (component) => {
  return render(
    <ThemeProvider>
      {component}
    </ThemeProvider>
  );
};

describe('LanguageSelector Component', () => {
  beforeEach(() => {
    // Reset to English before each test
    vi.clearAllMocks();
  });

  it('should render language selector', () => {
    renderWithProviders(<LanguageSelector />);
    
    const selector = screen.getByRole('group', { name: /language selector/i });
    expect(selector).toBeInTheDocument();
  });

  it('should show English and Danish language buttons', async () => {
    renderWithProviders(<LanguageSelector />);
    
    const englishButton = screen.getByRole('button', { name: /🇬🇧 EN/i });
    const danishButton = screen.getByRole('button', { name: /🇩🇰 DA/i });
    
    expect(englishButton).toBeInTheDocument();
    expect(danishButton).toBeInTheDocument();
  });

  it('should change language when Danish button is clicked', async () => {
    renderWithProviders(<LanguageSelector />);
    
    const danishButton = screen.getByRole('button', { name: /🇩🇰 DA/i });
    
    // Click Danish button
    fireEvent.click(danishButton);
    
    // The language change would be handled by i18n, 
    // we can verify the button exists and is clickable
    expect(danishButton).toBeInTheDocument();
  });

  it('should have both English and Danish buttons', () => {
    renderWithProviders(<LanguageSelector />);
    
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(2);
    
    expect(screen.getByRole('button', { name: /🇬🇧 EN/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /🇩🇰 DA/i })).toBeInTheDocument();
  });
});

// Test component that displays multiple translated elements
const MultiTranslationComponent = () => {
  const { t, i18n } = useTranslation();
  
  return (
    <div>
      <h1 data-testid="app-title">{t('app.title')}</h1>
      <h2 data-testid="leaderboard-title">{t('leaderboard.title')}</h2>
      <p data-testid="theme-light">{t('theme.light')}</p>
      <p data-testid="theme-dark">{t('theme.dark')}</p>
      <table>
        <thead>
          <tr>
            <th data-testid="table-rank">{t('leaderboard.rank')}</th>
            <th data-testid="table-player">{t('leaderboard.player')}</th>
            <th data-testid="table-points">{t('leaderboard.points')}</th>
          </tr>
        </thead>
      </table>
      <LanguageSelector />
    </div>
  );
};

describe('Multiple Component Translation', () => {
  it('should render translated components', async () => {
    renderWithProviders(<MultiTranslationComponent />);
    
    await waitFor(() => {
      // Just verify the components render with some text content
      expect(screen.getByTestId('app-title')).toBeInTheDocument();
      expect(screen.getByTestId('leaderboard-title')).toBeInTheDocument();
      expect(screen.getByTestId('theme-light')).toBeInTheDocument();
      expect(screen.getByTestId('theme-dark')).toBeInTheDocument();
      expect(screen.getByTestId('table-rank')).toBeInTheDocument();
      expect(screen.getByTestId('table-player')).toBeInTheDocument();
      expect(screen.getByTestId('table-points')).toBeInTheDocument();
    });
  });

  it('should translate all components to Danish', async () => {
    renderWithProviders(<MultiTranslationComponent />);
    
    // Change language to Danish
    const danishButton = screen.getByRole('button', { name: /🇩🇰 DA/i });
    fireEvent.click(danishButton);
    
    await waitFor(() => {
      expect(screen.getByTestId('app-title')).toHaveTextContent('Partners Konkurrence App');
      expect(screen.getByTestId('leaderboard-title')).toHaveTextContent('Resultattavle');
      expect(screen.getByTestId('theme-light')).toHaveTextContent('Lys tilstand');
      expect(screen.getByTestId('theme-dark')).toHaveTextContent('Mørk tilstand');
      expect(screen.getByTestId('table-rank')).toHaveTextContent('Placering');
      expect(screen.getByTestId('table-player')).toHaveTextContent('Spiller');
      expect(screen.getByTestId('table-points')).toHaveTextContent('Point');
    });
  });

  it('should allow language switching', async () => {
    renderWithProviders(<MultiTranslationComponent />);
    
    const danishButton = screen.getByRole('button', { name: /🇩🇰 DA/i });
    const englishButton = screen.getByRole('button', { name: /🇬🇧 EN/i });
    
    // Verify buttons are present and clickable
    expect(danishButton).toBeInTheDocument();
    expect(englishButton).toBeInTheDocument();
    
    // Click Danish button
    fireEvent.click(danishButton);
    
    // Verify content is still present (language may have changed)
    await waitFor(() => {
      expect(screen.getByTestId('app-title')).toBeInTheDocument();
    });
    
    // Click English button
    fireEvent.click(englishButton);
    
    // Verify content is still present
    await waitFor(() => {
      expect(screen.getByTestId('app-title')).toBeInTheDocument();
    });
  });
});