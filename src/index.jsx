import React from 'react';
import ReactDOM from 'react-dom/client';
import RestoredApp from './RestoredApp.jsx';

console.log('Index.jsx is loading - Full app restored!');
console.log('React:', React);
console.log('ReactDOM:', ReactDOM);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RestoredApp />
  </React.StrictMode>
);
