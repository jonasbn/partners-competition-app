import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useTranslation } from 'react-i18next';
import { ThemeProvider } from '../../utils/ThemeContext';
import '../../utils/i18n';

// Test component that uses translations
const TestTranslationComponent = ({ translationKey = 'app.title' }) => {
  const { t, i18n } = useTranslation();
  
  return (
    <div>
      <h1 data-testid="translated-text">{t(translationKey)}</h1>
      <button 
        data-testid="change-to-danish" 
        onClick={() => i18n.changeLanguage('da')}
      >
        Change to Danish
      </button>
      <button 
        data-testid="change-to-english" 
        onClick={() => i18n.changeLanguage('en')}
      >
        Change to English
      </button>
      <span data-testid="current-language">{i18n.language}</span>
    </div>
  );
};

const renderWithProviders = (component) => {
  return render(
    <ThemeProvider>
      {component}
    </ThemeProvider>
  );
};

describe('Translation Component Integration', () => {
  it('should render translated text correctly', async () => {
    renderWithProviders(<TestTranslationComponent />);
    
    // First ensure we're in English
    const changeToEnglish = screen.getByTestId('change-to-english');
    fireEvent.click(changeToEnglish);
    
    await waitFor(() => {
      const translatedText = screen.getByTestId('translated-text');
      expect(translatedText).toHaveTextContent('Partners Competition App');
    });
  });

  it('should change language to Danish when button is clicked', async () => {
    renderWithProviders(<TestTranslationComponent />);
    
    const changeButton = screen.getByTestId('change-to-danish');
    fireEvent.click(changeButton);
    
    await waitFor(() => {
      const translatedText = screen.getByTestId('translated-text');
      expect(translatedText).toHaveTextContent('Partners Konkurrence App');
    });
  });

  it('should change language back to English', async () => {
    renderWithProviders(<TestTranslationComponent />);
    
    // First change to Danish
    const changeToDanish = screen.getByTestId('change-to-danish');
    fireEvent.click(changeToDanish);
    
    await waitFor(() => {
      const translatedText = screen.getByTestId('translated-text');
      expect(translatedText).toHaveTextContent('Partners Konkurrence App');
    });
    
    // Then change back to English
    const changeToEnglish = screen.getByTestId('change-to-english');
    fireEvent.click(changeToEnglish);
    
    await waitFor(() => {
      const translatedText = screen.getByTestId('translated-text');
      expect(translatedText).toHaveTextContent('Partners Competition App');
    });
  });

  it('should display current language correctly', async () => {
    renderWithProviders(<TestTranslationComponent />);
    
    // Check initial language
    const languageDisplay = screen.getByTestId('current-language');
    expect(languageDisplay).toHaveTextContent('en');
    
    // Change to Danish
    const changeButton = screen.getByTestId('change-to-danish');
    fireEvent.click(changeButton);
    
    await waitFor(() => {
      expect(languageDisplay).toHaveTextContent('da');
    });
  });

  it('should handle different translation keys', async () => {
    renderWithProviders(<TestTranslationComponent translationKey="leaderboard.title" />);
    
    // Ensure we start in English
    const changeToEnglish = screen.getByTestId('change-to-english');
    fireEvent.click(changeToEnglish);
    
    await waitFor(() => {
      const translatedText = screen.getByTestId('translated-text');
      expect(translatedText).toHaveTextContent('Leaderboard');
    });
    
    // Change to Danish
    const changeButton = screen.getByTestId('change-to-danish');
    fireEvent.click(changeButton);
    
    await waitFor(() => {
      const translatedText = screen.getByTestId('translated-text');
      expect(translatedText).toHaveTextContent('Resultattavle');
    });
  });

  it('should handle nested translation keys', async () => {
    renderWithProviders(<TestTranslationComponent translationKey="charts.playerStats.title" />);
    
    // Ensure we start in English
    const changeToEnglish = screen.getByTestId('change-to-english');
    fireEvent.click(changeToEnglish);
    
    await waitFor(() => {
      const translatedText = screen.getByTestId('translated-text');
      expect(translatedText).toHaveTextContent('Player Statistics');
    });
    
    // Change to Danish
    const changeButton = screen.getByTestId('change-to-danish');
    fireEvent.click(changeButton);
    
    await waitFor(() => {
      const translatedText = screen.getByTestId('translated-text');
      expect(translatedText).toHaveTextContent('Spillerstatistik');
    });
  });
});

// Test component for interpolation
const InterpolationTestComponent = () => {
  const { t, i18n } = useTranslation();
  
  return (
    <div>
      <p data-testid="interpolated-text">
        {t('app.footer', { year: 2024 })}
      </p>
      <p data-testid="complex-interpolation">
        {t('summary.mostWinningTeam.stats', { wins: 5, games: 10, rate: 50 })}
      </p>
      <button 
        data-testid="change-language" 
        onClick={() => i18n.changeLanguage(i18n.language === 'en' ? 'da' : 'en')}
      >
        Toggle Language
      </button>
    </div>
  );
};

describe('Translation Interpolation', () => {
  it('should handle interpolation in English', async () => {
    renderWithProviders(<InterpolationTestComponent />);
    
    // Toggle to ensure we're in English (toggle twice if needed)
    const toggleButton = screen.getByTestId('change-language');
    
    // First check current language and get to English
    await waitFor(() => {
      const interpolatedText = screen.getByTestId('interpolated-text');
      if (interpolatedText.textContent.includes('Konkurrence')) {
        fireEvent.click(toggleButton);
      }
    });
    
    await waitFor(() => {
      const interpolatedText = screen.getByTestId('interpolated-text');
      expect(interpolatedText).toHaveTextContent('Partners Competition App © 2024');
    });
  });

  it('should handle interpolation in Danish', async () => {
    renderWithProviders(<InterpolationTestComponent />);
    
    const toggleButton = screen.getByTestId('change-language');
    
    // First ensure we're in Danish
    await waitFor(() => {
      const interpolatedText = screen.getByTestId('interpolated-text');
      if (interpolatedText.textContent.includes('Competition')) {
        fireEvent.click(toggleButton);
      }
    });
    
    await waitFor(() => {
      const interpolatedText = screen.getByTestId('interpolated-text');
      expect(interpolatedText).toHaveTextContent('Partners Konkurrence App © 2024');
    });
  });

  it('should handle complex interpolation', async () => {
    renderWithProviders(<InterpolationTestComponent />);
    
    // Just verify interpolation works regardless of language
    await waitFor(() => {
      const complexText = screen.getByTestId('complex-interpolation');
      // Should contain the interpolated numbers
      expect(complexText.textContent).toContain('5');
      expect(complexText.textContent).toContain('10');
      expect(complexText.textContent).toContain('50');
    });
    
    // Change language and verify interpolation still works
    const toggleButton = screen.getByTestId('change-language');
    fireEvent.click(toggleButton);
    
    await waitFor(() => {
      const complexText = screen.getByTestId('complex-interpolation');
      // Should still contain the interpolated numbers
      expect(complexText.textContent).toContain('5');
      expect(complexText.textContent).toContain('10');
      expect(complexText.textContent).toContain('50');
    });
  });
});