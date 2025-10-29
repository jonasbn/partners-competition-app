import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import ErrorBoundary from '../../components/ErrorBoundary';

// Component that throws an error
const ThrowError = ({ shouldThrow }) => {
  if (shouldThrow) {
    throw new Error('Test error');
  }
  return <div>No error</div>;
};

// Mock console.error to avoid cluttering test output
const originalError = console.error;
beforeAll(() => {
  console.error = vi.fn();
});

afterAll(() => {
  console.error = originalError;
});

describe('ErrorBoundary Component', () => {
  it('renders children when there is no error', () => {
    render(
      <ErrorBoundary name="TestBoundary">
        <ThrowError shouldThrow={false} />
      </ErrorBoundary>
    );
    
    expect(screen.getByText('No error')).toBeInTheDocument();
  });

  it('renders error UI when child component throws', () => {
    render(
      <ErrorBoundary name="TestBoundary">
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );
    
    // The error boundary should catch the error and display fallback UI
    // Look for typical error messages or fallback content
    expect(screen.queryByText('No error')).not.toBeInTheDocument();
    
    // The exact text depends on your ErrorBoundary implementation
    // but it should render some error indication
    const errorElement = document.querySelector('.alert, .error, [role="alert"]');
    expect(errorElement).toBeInTheDocument();
  });

  it('accepts name prop', () => {
    render(
      <ErrorBoundary name="TestBoundary">
        <div>Test content</div>
      </ErrorBoundary>
    );
    
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });
});