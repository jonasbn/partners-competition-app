import '@testing-library/jest-dom';

// Mock for window.matchMedia (used by Bootstrap)
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock for logger since it uses external service
vi.mock('../utils/logger', () => ({
  default: {
    info: vi.fn(),
    event: vi.fn(),
    flush: vi.fn(),
    error: vi.fn(),
    userAction: vi.fn(),
  },
}));

// Mock for IntersectionObserver (might be used by charts)
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  disconnect: vi.fn(),
  observe: vi.fn(),
  unobserve: vi.fn(),
}));

// Mock for ResizeObserver (used by charts)
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  disconnect: vi.fn(),
  observe: vi.fn(),
  unobserve: vi.fn(),
}));