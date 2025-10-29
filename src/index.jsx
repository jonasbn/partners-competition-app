import React from 'react';
import ReactDOM from 'react-dom/client';
import SuperMinimalApp from './SuperMinimalApp.jsx';

console.log('Index.jsx is loading...');
console.log('React:', React);
console.log('ReactDOM:', ReactDOM);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <SuperMinimalApp />
  </React.StrictMode>
);
