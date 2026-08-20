import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import App from './App';
import { ThemeProvider } from './utils/ThemeContext';
import { ViewProvider } from './utils/ViewContext';
import { YearProvider } from './utils/YearContext';
// Import i18n configuration
import './utils/i18n';

const root = ReactDOM.createRoot(document.getElementById('root'));

// Simple, reliable React 18 rendering
root.render(
  <React.StrictMode>
    <ThemeProvider>
      <ViewProvider>
        <YearProvider>
          <App />
        </YearProvider>
      </ViewProvider>
    </ThemeProvider>
  </React.StrictMode>
);
