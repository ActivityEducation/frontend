// src/index.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router';
import { Provider } from 'react-redux';

import './index.css'; // Keep existing global styles

import App from './App'; // The main App component
import reportWebVitals from './reportWebVitals';
import store from './redux/store'; // Import the Redux store

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <Provider store={store}> {/* Wrap App with Redux Provider */}
      <Router basename='/app'> {/* Wrap with BrowserRouter for routing */}
        <App />
      </Router>
    </Provider>
  </React.StrictMode>
);

reportWebVitals();
