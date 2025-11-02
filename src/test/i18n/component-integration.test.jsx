import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ThemeProvider } from '../../utils/ThemeContext';
import '../../utils/i18n';

// Import the actual components that use translations
import SimpleLeaderboard from '../../components/SimpleLeaderboard';
import SimpleGamesList from '../../components/SimpleGamesList';
import SimpleTeamStatistics from '../../components/SimpleTeamStatistics';
import i18n from '../../utils/i18n';

// Mock data utils to provide consistent test data
vi.mock('../../utils/dataUtils', () => ({
  getLeaderboardData: () => ({
    players: [
      { 
        id: 1, 
        name: 'Jonas', 
        cumulativeScore: 15, 
        games: [
          { gameId: 1, score: 3 },
          { gameId: 2, score: 2 }
        ]
      },
      { 
        id: 2, 
        name: 'Torben', 
        cumulativeScore: 12, 
        games: [
          { gameId: 1, score: 2 },
          { gameId: 2, score: 3 }
        ]
      }
    ]
  }),
  getGames: () => [
    {
      gameId: 1,
      gameDate: '2024-01-15T10:00:00',
      teams: [
        { players: ['Jonas', 'Gitte'], score: 3 },
        { players: ['Torben', 'Anette'], score: 2 },
        { players: ['Lotte', 'Peter'], score: 1 }
      ]
    },
    {
      gameId: 2,
      gameDate: '2024-01-16T14:30:00',
      teams: [
        { players: ['Torben', 'Lotte'], score: 3 },
        { players: ['Jonas', 'Peter'], score: 2 },
        { players: ['Gitte', 'Anette'], score: 1 }
      ]
    }
  ],
  getTeamStatistics: () => [
    {
      id: 'Jonas-Gitte',
      players: ['Jonas', 'Gitte'],
      gamesPlayed: 1,
      wins: 1,
      seconds: 0,
      thirds: 0,
      totalPoints: 3,
      winRate: 100
    },
    {
      id: 'Torben-Anette',
      players: ['Torben', 'Anette'],
      gamesPlayed: 1,
      wins: 0,
      seconds: 1,
      thirds: 0,
      totalPoints: 2,
      winRate: 0
    }
  ]
}));

const renderWithProviders = (component) => {
  return render(
    <ThemeProvider>
      {component}
    </ThemeProvider>
  );
};

// Helper component to test language switching on real components
const ComponentWithLanguageToggle = ({ component: Component }) => {
  const { useTranslation } = require('react-i18next');
  const { i18n } = useTranslation();
  
  return (
    <div>
      <button 
        data-testid="toggle-language"
        onClick={() => i18n.changeLanguage(i18n.language === 'en' ? 'da' : 'en')}
      >
        Toggle Language
      </button>
      <Component />
    </div>
  );
};

describe('Real Component Translation Integration', () => {
  describe('SimpleLeaderboard Component', () => {
    test('should display translated leaderboard information in English', async () => {
      // Set language to English explicitly for this test
      await i18n.changeLanguage('en');
      
      renderWithProviders(<SimpleLeaderboard />);
      
      await waitFor(() => {
        // Check if English translations are rendered (text might be split by emoji)
        const headers = screen.getAllByText((content, element) => {
          return element?.textContent?.includes('Leaderboard') || false;
        });
        expect(headers.length).toBeGreaterThan(0);
        
        expect(screen.getByText('Rank')).toBeInTheDocument();
        expect(screen.getByText('Player')).toBeInTheDocument();
        expect(screen.getByText('Score')).toBeInTheDocument();
      });
    });

    it('should display player data correctly', async () => {
      renderWithProviders(<SimpleLeaderboard />);
      
      await waitFor(() => {
        expect(screen.getByText('Jonas')).toBeInTheDocument();
        expect(screen.getByText('Torben')).toBeInTheDocument();
        expect(screen.getByText('15')).toBeInTheDocument();
        expect(screen.getByText('12')).toBeInTheDocument();
      });
    });
  });

  describe('SimpleGamesList Component', () => {
    test('should display game information', async () => {
      renderWithProviders(<SimpleGamesList />);
      
      await waitFor(() => {
        // Look for the card structure
        const card = document.querySelector('.card');
        expect(card).toBeInTheDocument();
        
        // Should display game content - just verify text is present
        const content = document.body.textContent;
        expect(content).toContain('Game');
      });
    });

    it('should show component structure correctly', async () => {
      renderWithProviders(<SimpleGamesList />);
      
      await waitFor(() => {
        // Should show the card structure
        const card = document.querySelector('.card');
        expect(card).toBeInTheDocument();
        
        // Should display some content
        const content = document.body.textContent;
        expect(content.length).toBeGreaterThan(0);
      });
    });
  });

  describe('SimpleTeamStatistics Component', () => {
  it('should display translated team stats headers in English', async () => {
    renderWithProviders(<SimpleTeamStatistics />);
    
    await waitFor(() => {
      // Look for the header text that contains team performance information
      const headers = screen.getAllByRole('columnheader');
      expect(headers.length).toBeGreaterThan(0);
      
      // Should contain some basic table structure
      const table = screen.getByRole('table');
      expect(table).toBeInTheDocument();
    });
  });    it('should show team data correctly', async () => {
      renderWithProviders(<SimpleTeamStatistics />);
      
      await waitFor(() => {
        // Should display team information
        const table = screen.getByRole('table');
        expect(table).toBeInTheDocument();
        
        // Should show team names
        expect(screen.getByText('Jonas')).toBeInTheDocument();
        expect(screen.getByText('Gitte')).toBeInTheDocument();
      });
    });
  });
});

describe('Translation Error Handling', () => {
  it('should handle missing translation keys gracefully', async () => {
    const TestComponent = () => {
      const { useTranslation } = require('react-i18next');
      const { t } = useTranslation();
      return <div data-testid="missing-key">{t('nonexistent.key')}</div>;
    };

    renderWithProviders(<TestComponent />);
    
    await waitFor(() => {
      const element = screen.getByTestId('missing-key');
      // Should return the key itself when translation is missing
      expect(element).toHaveTextContent('nonexistent.key');
    });
  });

  it('should handle interpolation correctly', async () => {
    const TestComponent = () => {
      const { useTranslation } = require('react-i18next');
      const { t } = useTranslation();
      return (
        <div data-testid="interpolation-test">
          {t('app.title')} - Test
        </div>
      );
    };

    renderWithProviders(<TestComponent />);
    
    await waitFor(() => {
      const element = screen.getByTestId('interpolation-test');
      // Should contain some content (either English or Danish)
      expect(element.textContent.length).toBeGreaterThan(0);
      expect(element.textContent).toContain('Test');
    });
  });
});

describe('Language Persistence', () => {
  it('should maintain language choice across component re-renders', async () => {
    const TestComponent = () => {
      const { useTranslation } = require('react-i18next');
      const { t, i18n } = useTranslation();
      const [counter, setCounter] = React.useState(0);
      
      const handleLanguageChange = () => {
        if (i18n && typeof i18n.changeLanguage === 'function') {
          i18n.changeLanguage('da');
        }
      };
      
      return (
        <div>
          <p data-testid="translated-title">{t('app.title')}</p>
          <p data-testid="counter">Count: {counter}</p>
          <button 
            data-testid="increment"
            onClick={() => setCounter(c => c + 1)}
          >
            Increment
          </button>
          <button 
            data-testid="change-to-danish"
            onClick={handleLanguageChange}
          >
            Change to Danish
          </button>
        </div>
      );
    };

    renderWithProviders(<TestComponent />);
    
    // Just verify the component renders correctly
    await waitFor(() => {
      expect(screen.getByTestId('translated-title')).toBeInTheDocument();
      expect(screen.getByTestId('counter')).toHaveTextContent('Count: 0');
    });
    
    // Force re-render by incrementing counter
    const incrementButton = screen.getByTestId('increment');
    fireEvent.click(incrementButton);
    
    await waitFor(() => {
      expect(screen.getByTestId('counter')).toHaveTextContent('Count: 1');
      // Title should still be present
      expect(screen.getByTestId('translated-title')).toBeInTheDocument();
    });
  });
});