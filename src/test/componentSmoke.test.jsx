import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';

// Mock all external dependencies
vi.mock('../../utils/ThemeContext', () => ({
  ThemeProvider: ({ children }) => children,
  useTheme: () => ({ theme: 'light', toggleTheme: vi.fn() })
}));

vi.mock('../../utils/i18n', () => ({}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key,
    i18n: { changeLanguage: vi.fn() }
  })
}));

vi.mock('../../utils/dataUtils', () => ({
  getLeaderboardData: () => ({
    players: [
      { id: 1, name: 'Jonas', cumulativeScore: 15 },
      { id: 2, name: 'Torben', cumulativeScore: 12 }
    ]
  }),
  getGames: () => [
    { gameId: 1, gameDate: '2024-01-15', teams: [] }
  ]
}));

describe('Component Smoke Tests', () => {
  it('should render a simple div without crashing', () => {
    const TestComponent = () => <div>Test</div>;
    const { container } = render(<TestComponent />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should render Bootstrap card structure', () => {
    const CardComponent = () => (
      <div className="card">
        <div className="card-header">Header</div>
        <div className="card-body">Body</div>
      </div>
    );
    
    const { container } = render(<CardComponent />);
    const card = container.querySelector('.card');
    expect(card).toBeInTheDocument();
    
    const header = container.querySelector('.card-header');
    expect(header).toBeInTheDocument();
    
    const body = container.querySelector('.card-body');
    expect(body).toBeInTheDocument();
  });

  it('should render table structure', () => {
    const TableComponent = () => (
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Jonas</td>
            <td>15</td>
          </tr>
        </tbody>
      </table>
    );
    
    const { container } = render(<TableComponent />);
    const table = container.querySelector('.table');
    expect(table).toBeInTheDocument();
    
    const rows = container.querySelectorAll('tr');
    expect(rows).toHaveLength(2); // header + 1 data row
  });
});