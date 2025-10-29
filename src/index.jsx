import React from 'react';
import ReactDOM from 'react-dom/client';
import Step5App from './Step5App.jsx';

console.log('Index.jsx is loading...');
console.log('React:', React);
console.log('ReactDOM:', ReactDOM);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Step5App />
  </React.StrictMode>
);
