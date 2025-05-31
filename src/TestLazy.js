// Test file to check React lazy import
import React from 'react';

console.log('React version:', React.version);
console.log('Lazy function:', typeof React.lazy);
console.log('Suspense component:', typeof React.Suspense);

// Simple test component
const TestComponent = () => {
  return <div>Test component loaded</div>;
};

// Test lazy loading
const LazyTestComponent = React.lazy(() => Promise.resolve({ default: TestComponent }));

const App = () => {
  return (
    <div>
      <h1>React Lazy Import Test</h1>
      <React.Suspense fallback={<div>Loading...</div>}>
        <LazyTestComponent />
      </React.Suspense>
    </div>
  );
};

export default App;
